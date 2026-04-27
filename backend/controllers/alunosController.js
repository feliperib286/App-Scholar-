const pool = require('../database/db');

// GET /api/alunos
async function listar(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM alunos ORDER BY nome ASC'
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
    const result = await pool.query(
      'SELECT * FROM alunos WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar aluno.' });
  }
}

// POST /api/alunos
async function criar(req, res) {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

  if (!nome || !matricula) {
    return res.status(400).json({ erro: 'Nome e matrícula são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado]
    );
    res.status(201).json({
      mensagem: 'Aluno cadastrado com sucesso!',
      aluno: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') { // unique violation
      return res.status(409).json({ erro: 'Matrícula já cadastrada.' });
    }
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar aluno.' });
  }
}

// PUT /api/alunos/:id
async function atualizar(req, res) {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

  try {
    const result = await pool.query(
      `UPDATE alunos SET nome=$1, matricula=$2, curso=$3, email=$4,
       telefone=$5, cep=$6, endereco=$7, cidade=$8, estado=$9
       WHERE id=$10 RETURNING *`,
      [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }
    res.json({ mensagem: 'Aluno atualizado!', aluno: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar aluno.' });
  }
}

// DELETE /api/alunos/:id
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

module.exports = { listar, buscarPorId, criar, atualizar, remover };
