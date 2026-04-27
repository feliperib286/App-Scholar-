const pool = require('../database/db');

// GET /api/professores
async function listar(req, res) {
  try {
    const result = await pool.query('SELECT * FROM professores ORDER BY nome ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar professores.' });
  }
}

// GET /api/professores/:id
async function buscarPorId(req, res) {
  try {
    const result = await pool.query('SELECT * FROM professores WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar professor.' });
  }
}

// POST /api/professores
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

// PUT /api/professores/:id
async function atualizar(req, res) {
  const { nome, titulacao, area, tempo_docencia, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE professores SET nome=$1, titulacao=$2, area=$3, tempo_docencia=$4, email=$5
       WHERE id=$6 RETURNING *`,
      [nome, titulacao, area, tempo_docencia, email, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
    res.json({ mensagem: 'Professor atualizado!', professor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar professor.' });
  }
}

// DELETE /api/professores/:id
async function remover(req, res) {
  try {
    const result = await pool.query('DELETE FROM professores WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
    res.json({ mensagem: 'Professor removido.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover professor.' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
