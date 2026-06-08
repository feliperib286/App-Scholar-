const pool = require('../database/db');

// 1. Listar todos
async function listar(req, res) {
  try {
    const result = await pool.query('SELECT id, nome, matricula, curso, email, telefone FROM alunos ORDER BY nome ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar alunos.' });
  }
}

// 2. Buscar por ID
async function buscarPorId(req, res) {
  try {
    if (req.params.id === 'meu-perfil') {
      const result = await pool.query(
        'SELECT * FROM alunos WHERE email = (SELECT email FROM usuarios WHERE id = $1)',
        [req.user.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
      return res.json(result.rows[0]);
    }
    const result = await pool.query('SELECT * FROM alunos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar aluno.' });
  }
}

// 3. Cadastrar Aluno
async function criar(req, res) {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;
  if (!nome || !matricula || !email) {
    return res.status(400).json({ erro: 'Nome, matrícula e e-mail são obrigatórios.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nome, matricula, curso, email.trim().toLowerCase(), telefone, cep, endereco, cidade, estado]
    );
    res.status(201).json({ mensagem: 'Aluno cadastrado!', aluno: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar.' });
  }
}
// Adicione isso no seu alunoController.js
async function atualizarMeuPerfil(req, res) {
  const { telefone, cep, endereco, cidade, estado } = req.body;
  try {
    // Busca o aluno pelo ID do usuário logado
    const result = await pool.query(
      `UPDATE alunos SET telefone=$1, cep=$2, endereco=$3, cidade=$4, estado=$5 
       WHERE email = (SELECT email FROM usuarios WHERE id = $6) RETURNING *`,
      [telefone, cep, endereco, cidade, estado, req.user.id]
    );
    res.json({ mensagem: 'Perfil atualizado!', aluno: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar perfil.' });
  }
}

// 4. ATUALIZAR (Unificada e Corrigida)
async function atualizar(req, res) {
  let idDoParametro = req.params.id;
  const idUsuarioLogado = req.user.id;
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

  try {
    const alunoLogadoQuery = await pool.query(
      'SELECT id FROM alunos WHERE email = (SELECT email FROM usuarios WHERE id = $1)',
      [idUsuarioLogado]
    );
    const idAlunoLogado = alunoLogadoQuery.rows[0]?.id;

    if (idDoParametro === 'meu-perfil') {
      idDoParametro = idAlunoLogado;
    }

    if (req.user.role !== 'adm' && String(idAlunoLogado) !== String(idDoParametro)) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    let result;
    if (req.user.role === 'adm') {
      // ADMIN: Pode tudo
      result = await pool.query(
        `UPDATE alunos SET nome=$1, matricula=$2, curso=$3, email=$4, telefone=$5, cep=$6, endereco=$7, cidade=$8, estado=$9 
         WHERE id=$10 RETURNING *`,
        [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, idDoParametro]
      );
    } else {
      // ALUNO: Pode alterar tudo, EXCETO Matrícula e Nome (para evitar fraude)
      // Adicionamos 'email' e 'curso' aqui também, caso queira que ele edite
      result = await pool.query(
        `UPDATE alunos SET email=$1, telefone=$2, cep=$3, endereco=$4, cidade=$5, estado=$6 
         WHERE id=$7 RETURNING *`,
        [email, telefone, cep, endereco, cidade, estado, idAlunoLogado]
      );
    }

    if (result.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    res.json({ mensagem: 'Dados atualizados!', aluno: result.rows[0] });
  } catch (err) {
    console.error("ERRO NO UPDATE:", err);
    res.status(500).json({ erro: 'Erro ao atualizar dados: ' + err.message });
  }
}

// 5. Remover
async function remover(req, res) {
  const { id } = req.params;
  try {
    const aluno = await pool.query('SELECT email FROM alunos WHERE id = $1', [id]);
    if (aluno.rows.length > 0) {
      await pool.query('DELETE FROM notas WHERE aluno_id = $1', [id]);
      await pool.query('DELETE FROM alunos WHERE id = $1', [id]);
      await pool.query('DELETE FROM usuarios WHERE email = $1', [aluno.rows[0].email]);
    }
    res.json({ mensagem: 'Removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover.' });
  }
}

// 6 e 7. Boletim e Grade
async function consultarMeuBoletim(req, res) { 
  try {
    const query = `SELECT n.id, d.nome AS disciplina, n.nota1, n.nota2, n.media, n.situacao 
                   FROM notas n JOIN disciplinas d ON n.disciplina_id = d.id 
                   JOIN alunos a ON n.aluno_id = a.id 
                   WHERE a.email = (SELECT email FROM usuarios WHERE id = $1)`;
    const resultado = await pool.query(query, [req.user.id]);
    res.json(resultado.rows);
  } catch (err) { res.status(500).json({ erro: 'Erro ao buscar boletim.' }); }
}

async function consultarMinhaGrade(req, res) { 
  try {
    const query = `SELECT d.id, d.nome AS disciplina, d.semestre FROM disciplinas d 
                   WHERE d.id IN (SELECT disciplina_id FROM notas WHERE aluno_id = (SELECT id FROM alunos WHERE email = (SELECT email FROM usuarios WHERE id = $1)))`;
    const resultado = await pool.query(query, [req.user.id]);
    res.json(resultado.rows);
  } catch (err) { res.status(500).json({ erro: 'Erro ao buscar grade.' }); }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover, consultarMeuBoletim, consultarMinhaGrade };