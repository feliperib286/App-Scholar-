const pool = require('../database/db');

// ==========================================
// 1. GET /api/alunos - Listar todos (Apenas Admin)
// ==========================================
async function listar(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, nome, matricula, curso, email, telefone FROM alunos ORDER BY nome ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar alunos.' });
  }
}

// GET /api/alunos/:id
async function buscarPorId(req, res) {
  try {
    // Se a requisição pedir 'meu-perfil', busca pelo e-mail do token
    if (req.params.id === 'meu-perfil') {
      const result = await pool.query(
        'SELECT * FROM alunos WHERE email = (SELECT email FROM usuarios WHERE id = $1)',
        [req.user.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
      return res.json(result.rows[0]);
    }

    // Fluxo normal (Admin acessando)
    const result = await pool.query('SELECT * FROM alunos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar aluno.' });
  }
}

// PUT /api/alunos/:id
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

    // Converte a palavra 'meu-perfil' para o ID real do aluno logado
    if (idDoParametro === 'meu-perfil') {
      idDoParametro = idAlunoLogado;
    }

    if (req.user.role !== 'adm' && String(idAlunoLogado) !== String(idDoParametro)) {
      return res.status(403).json({ erro: 'Você só pode alterar seus próprios dados.' });
    }

    let result;
    if (req.user.role === 'adm') {
      result = await pool.query(
        `UPDATE alunos SET nome=$1, matricula=$2, curso=$3, email=$4, telefone=$5, cep=$6, endereco=$7, cidade=$8, estado=$9 WHERE id=$10 RETURNING *`,
        [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, idDoParametro]
      );
    } else {
      result = await pool.query(
        `UPDATE alunos SET nome=$1, matricula=$2, curso=$3, telefone=$4, cep=$5, endereco=$6, cidade=$7, estado=$8 WHERE id=$9 RETURNING *`,
        [nome, matricula, curso, telefone, cep, endereco, cidade, estado, idAlunoLogado]
      );
    }

    if (result.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    res.json({ mensagem: 'Dados atualizados com sucesso!', aluno: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar aluno.' });
  }
}
// ==========================================
// 3. POST /api/alunos - Cadastrar Aluno (Apenas Admin)
// ==========================================
async function criar(req, res) {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

  if (!nome || !matricula || !email) {
    return res.status(400).json({ erro: 'Nome, matrícula e e-mail são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [nome, matricula, curso, email.trim().toLowerCase(), telefone, cep, endereco, cidade, estado]
    );
    res.status(201).json({
      mensagem: 'Aluno cadastrado com sucesso!',
      aluno: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') { 
      return res.status(409).json({ erro: 'Matrícula ou E-mail já cadastrado.' });
    }
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar aluno.' });
  }
}

// ==========================================
// 4. PUT /api/alunos/:id - Atualizar Dados (Admin ou o Próprio Aluno)
// ==========================================
async function atualizar(req, res) {
  const idDoParametro = req.params.id;
  const idUsuarioLogado = req.user.id; // ID vindo do token JWT (tabela usuarios)
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

  try {
    // Busca o ID do aluno associado ao usuário logado usando o e-mail como ponte
    const alunoLogadoQuery = await pool.query(
      'SELECT id FROM alunos WHERE email = (SELECT email FROM usuarios WHERE id = $1)',
      [idUsuarioLogado]
    );
    
    const idAlunoLogado = alunoLogadoQuery.rows[0]?.id;

    // TRAVA DE SEGURANÇA: Se não for admin E o ID da rota for diferente do ID dele, barra o acesso.
    if (req.user.role !== 'adm' && String(idAlunoLogado) !== String(idDoParametro)) {
      return res.status(403).json({ erro: 'Acesso negado. Você só pode alterar seus próprios dados.' });
    }

    let result;

    if (req.user.role === 'adm') {
      // O Admin tem permissão total para alterar qualquer campo
      result = await pool.query(
        `UPDATE alunos SET nome=$1, matricula=$2, curso=$3, email=$4,
         telefone=$5, cep=$6, endereco=$7, cidade=$8, estado=$9
         WHERE id=$10 RETURNING *`,
        [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, idDoParametro]
      );
    } else {
      // O Aluno comum só pode alterar dados de contato/endereço (protege nome, curso e matrícula)
      result = await pool.query(
        `UPDATE alunos SET telefone=$1, cep=$2, endereco=$3, cidade=$4, estado=$5
         WHERE id=$6 RETURNING *`,
        [telefone, cep, endereco, cidade, estado, idAlunoLogado]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }
    res.json({ mensagem: 'Dados atualizados com sucesso!', aluno: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar aluno.' });
  }
}

// ==========================================
// 5. DELETE /api/alunos/:id - Remover Aluno (Apenas Admin)
// ==========================================
async function remover(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM alunos WHERE id=$1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }
    res.json({ mensagem: 'Aluno removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover aluno.' });
  }
}

// ==========================================
// 6. GET /api/meu-boletim - Aluno consulta suas próprias notas
// ==========================================
async function consultarMeuBoletim(req, res) {
  const idUsuarioLogado = req.user.id; // Pega o ID do token da sessão

  try {
    // Faz o cruzamento buscando o aluno pelo e-mail do usuário logado
    const query = `
      SELECT
        n.id,
        d.nome AS disciplina,
        d.semestre,
        d.carga_horaria,
        p.nome AS professor,
        n.nota1,
        n.nota2,
        n.media,
        n.situacao
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      LEFT JOIN professores p ON d.professor_id = p.id
      JOIN alunos a ON n.aluno_id = a.id
      WHERE a.email = (SELECT email FROM usuarios WHERE id = $1)
      ORDER BY d.semestre ASC, d.nome ASC;
    `;

    const resultado = await pool.query(query, [idUsuarioLogado]);
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar boletim do aluno:', erro);
    res.status(500).json({ erro: 'Erro ao buscar seu boletim.' });
  }
}

// ==========================================
// 7. GET /api/minha-grade - Aluno consulta as disciplinas vinculadas
// ==========================================
async function consultarMinhaGrade(req, res) {
  const idUsuarioLogado = req.user.id;

  try {
    // Retorna as disciplinas do semestre nas quais o aluno possui registro de notas iniciado
    const query = `
      SELECT 
        d.id,
        d.nome AS disciplina,
        d.semestre,
        d.carga_horaria,
        p.nome AS professor
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      WHERE d.id IN (
        SELECT disciplina_id FROM notas WHERE aluno_id = (
          SELECT id FROM alunos WHERE email = (SELECT email FROM usuarios WHERE id = $1)
        )
      )
      ORDER BY d.semestre ASC, d.nome ASC;
    `;

    const resultado = await pool.query(query, [idUsuarioLogado]);
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar grade horária:', erro);
    res.status(500).json({ erro: 'Erro ao buscar sua grade de disciplinas.' });
  }
}

module.exports = { 
  listar, 
  buscarPorId, 
  criar, 
  atualizar, 
  remover, 
  consultarMeuBoletim, 
  consultarMinhaGrade 
};