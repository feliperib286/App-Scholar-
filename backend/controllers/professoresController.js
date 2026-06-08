const pool = require('../database/db');
// No seu controller de professores, use esta consulta:
async function listar(req, res) {
  try {
    const query = `
      SELECT p.*, 
             COALESCE(json_agg(d.nome) FILTER (WHERE d.id IS NOT NULL), '[]') as disciplinas
      FROM professores p
      LEFT JOIN professor_disciplina pd ON p.id = pd.professor_id
      LEFT JOIN disciplinas d ON pd.disciplina_id = d.id
      GROUP BY p.id
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar professores.' });
  }
}

// GET /api/professores/:id
async function buscarPorId(req, res) {
  try {
    if (req.params.id === 'meu-perfil') {
      const result = await pool.query(
        'SELECT * FROM professores WHERE email = (SELECT email FROM usuarios WHERE id = $1)',
        [req.user.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
      return res.json(result.rows[0]);
    }

    const result = await pool.query('SELECT * FROM professores WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar professor.' });
  }
}

// PUT /api/professores/:id
async function atualizar(req, res) {
  let idDoParametro = req.params.id;
  const idUsuarioLogado = req.user.id; 
  const { nome, titulacao, area, tempo_docencia, email } = req.body;

  try {
    const profLogadoQuery = await pool.query(
      'SELECT id FROM professores WHERE email = (SELECT email FROM usuarios WHERE id = $1)',
      [idUsuarioLogado]
    );
    const idProfLogado = profLogadoQuery.rows[0]?.id;

    if (idDoParametro === 'meu-perfil') {
      idDoParametro = idProfLogado;
    }

    if (req.user.role !== 'adm' && String(idProfLogado) !== String(idDoParametro)) {
      return res.status(403).json({ erro: 'Acesso negado. Você só pode alterar seus próprios dados.' });
    }

    let result;
    if (req.user.role === 'adm') {
      result = await pool.query(
        `UPDATE professores SET nome=$1, titulacao=$2, area=$3, tempo_docencia=$4, email=$5 WHERE id=$6 RETURNING *`,
        [nome, titulacao, area, tempo_docencia, email, idDoParametro]
      );
    } else {
      result = await pool.query(
        `UPDATE professores SET nome=$1, titulacao=$2, area=$3, tempo_docencia=$4 WHERE id=$5 RETURNING *`,
        [nome, titulacao, area, tempo_docencia, idProfLogado]
      );
    }

    if (result.rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
    res.json({ mensagem: 'Professor atualizado com sucesso!', professor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar professor.' });
  }
}
// POST /api/professores (Apenas Admin)
async function criar(req, res) {
  const { nome, titulacao, area, tempo_docencia, email } = req.body;

  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' });

  try {
    const result = await pool.query(
      `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nome, titulacao, area, tempo_docencia, email]
    );
    res.status(201).json({
      mensagem: 'Professor cadastrado com sucesso!',
      professor: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar professor.' });
  }
}

// PUT /api/professores/:id (Com trava de e-mail)
async function atualizar(req, res) {
  const idDoParametro = req.params.id;
  const idUsuarioLogado = req.user.id; 
  const { nome, titulacao, area, tempo_docencia, email } = req.body;

  try {
    // Descobre o ID do professor associado ao e-mail do usuário logado
    const profLogadoQuery = await pool.query(
      'SELECT id FROM professores WHERE email = (SELECT email FROM usuarios WHERE id = $1)',
      [idUsuarioLogado]
    );
    const idProfLogado = profLogadoQuery.rows[0]?.id;

    // TRAVA DE SEGURANÇA: Bloqueia se um professor tentar editar outro professor
    if (req.user.role !== 'adm' && String(idProfLogado) !== String(idDoParametro)) {
      return res.status(403).json({ erro: 'Acesso negado. Você só pode alterar seus próprios dados.' });
    }

    let result;

    if (req.user.role === 'adm') {
      // ADMIN: Altera TUDO, inclusive o e-mail
      result = await pool.query(
        `UPDATE professores SET nome=$1, titulacao=$2, area=$3, tempo_docencia=$4, email=$5
         WHERE id=$6 RETURNING *`,
        [nome, titulacao, area, tempo_docencia, email, idDoParametro]
      );
    } else {
      // PROFESSOR: Altera os dados profissionais, MAS NÃO O E-MAIL
      result = await pool.query(
        `UPDATE professores SET nome=$1, titulacao=$2, area=$3, tempo_docencia=$4
         WHERE id=$5 RETURNING *`,
        [nome, titulacao, area, tempo_docencia, idProfLogado]
      );
    }

    if (result.rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
    res.json({ mensagem: 'Professor atualizado com sucesso!', professor: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar professor.' });
  }
}

// DELETE /api/professores/:id (Apenas Admin)
async function remover(req, res) {
  const { id } = req.params;
  try {
    // Apaga o vínculo com as disciplinas primeiro
    await pool.query('DELETE FROM professor_disciplina WHERE professor_id = $1', [id]);
    // Depois apaga o professor
    await pool.query('DELETE FROM professores WHERE id = $1', [id]);
    
    res.json({ mensagem: 'Professor excluído!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir professor.' });
  }
}
// POST /api/professores/:id/vincular
async function vincularDisciplinas(req, res) {
  const { id } = req.params;
  const { disciplinas_ids } = req.body; // Recebe um array com os IDs das matérias marcadas

  try {
    // 1. Limpa as atribuições antigas desse professor para evitar duplicidade
    await pool.query('DELETE FROM professor_disciplina WHERE professor_id = $1', [id]);

    // 2. Insere as novas disciplinas selecionadas
    if (disciplinas_ids && disciplinas_ids.length > 0) {
      for (let discId of disciplinas_ids) {
        await pool.query(
          'INSERT INTO professor_disciplina (professor_id, disciplina_id) VALUES ($1, $2)',
          [id, discId]
        );
      }
    }
    res.json({ mensagem: 'Atribuição de aulas atualizada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao processar a atribuição de disciplinas.' });
  }
}

// Atualize a última linha do arquivo para exportar a função nova:
module.exports = { listar, buscarPorId, criar, atualizar, remover, vincularDisciplinas };

