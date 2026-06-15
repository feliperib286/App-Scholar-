const pool = require('../database/db');

async function listarAvisos(req, res) {
  try {
    const result = await pool.query('SELECT * FROM avisos ORDER BY data_publicacao DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar avisos.' });
  }
}

async function criarAviso(req, res) {
  const { titulo, conteudo } = req.body;
  const criadoPorId = req.user.id; // ID do Admin ou Professor logado

  if (!titulo || !conteudo) {
    return res.status(400).json({ erro: 'Título e conteúdo são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO avisos (titulo, conteudo, criado_por_id) VALUES ($1, $2, $3) RETURNING *',
      [titulo, conteudo, criadoPorId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao publicar aviso.' });
  }
}

module.exports = { listarAvisos, criarAviso };