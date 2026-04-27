const pool = require('../database/db');

// GET /api/disciplinas
async function listar(req, res) {
  try {
    const result = await pool.query(
      `SELECT d.*, p.nome AS professor_nome
       FROM disciplinas d
       LEFT JOIN professores p ON d.professor_id = p.id
       ORDER BY d.nome ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar disciplinas.' });
  }
}

// GET /api/disciplinas/:id
async function buscarPorId(req, res) {
  try {
    const result = await pool.query(
      `SELECT d.*, p.nome AS professor_nome
       FROM disciplinas d
       LEFT JOIN professores p ON d.professor_id = p.id
       WHERE d.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Disciplina não encontrada.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar disciplina.' });
  }
}

// POST /api/disciplinas
async function criar(req, res) {
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;

  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' });

  try {
    const result = await pool.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nome, carga_horaria, professor_id || null, curso, semestre]
    );
    res.status(201).json({
      mensagem: 'Disciplina cadastrada com sucesso!',
      disciplina: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar disciplina.' });
  }
}

// PUT /api/disciplinas/:id
async function atualizar(req, res) {
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;
  try {
    const result = await pool.query(
      `UPDATE disciplinas SET nome=$1, carga_horaria=$2, professor_id=$3, curso=$4, semestre=$5
       WHERE id=$6 RETURNING *`,
      [nome, carga_horaria, professor_id || null, curso, semestre, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Disciplina não encontrada.' });
    res.json({ mensagem: 'Disciplina atualizada!', disciplina: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar disciplina.' });
  }
}

// DELETE /api/disciplinas/:id
async function remover(req, res) {
  try {
    const result = await pool.query('DELETE FROM disciplinas WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Disciplina não encontrada.' });
    res.json({ mensagem: 'Disciplina removida.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover disciplina.' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
