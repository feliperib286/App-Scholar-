const pool = require('../database/db');

// GET /api/disciplinas
// GET /api/disciplinas
async function listar(req, res) {
  try {
    let query;
    let params = [];

    // SE FOR ADMIN, NÃO FILTRA POR PROFESSOR
    if (req.user && req.user.role === 'adm') {
      query = `SELECT d.*, p.nome AS professor_nome FROM disciplinas d 
               LEFT JOIN professores p ON d.professor_id = p.id ORDER BY d.nome ASC`;
    } else {
      // SE FOR PROFESSOR, FILTRA PELO ID DELE
      query = `SELECT d.*, p.nome AS professor_nome FROM disciplinas d 
               JOIN professor_disciplina pd ON d.id = pd.disciplina_id 
               LEFT JOIN professores p ON d.professor_id = p.id 
               WHERE pd.professor_id = $1 ORDER BY d.nome ASC`;
      params = [req.user.id];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar.' });
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
    // Insere a disciplina
    const result = await pool.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nome, carga_horaria, professor_id || null, curso, semestre]
    );
    
    const novaDisciplina = result.rows[0];

    // Se escolheu um professor, cria o vínculo logo no cadastro
    if (professor_id) {
      await pool.query('INSERT INTO professor_disciplina (professor_id, disciplina_id) VALUES ($1, $2)', [professor_id, novaDisciplina.id]);
    }

    res.status(201).json({ mensagem: 'Disciplina cadastrada!', disciplina: novaDisciplina });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar disciplina.' });
  }
}

// PUT /api/disciplinas/:id
async function atualizar(req, res) {
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;
  try {
    // 1. Atualiza a disciplina
    const result = await pool.query(
      `UPDATE disciplinas SET nome=$1, carga_horaria=$2, professor_id=$3, curso=$4, semestre=$5
       WHERE id=$6 RETURNING *`,
      [nome, carga_horaria, professor_id || null, curso, semestre, req.params.id]
    );
    
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Disciplina não encontrada.' });

    // 2. Sincroniza o vínculo na tabela auxiliar (professor_disciplina)
    // Remove o vínculo antigo e insere o novo (se um professor foi escolhido)
    await pool.query('DELETE FROM professor_disciplina WHERE disciplina_id = $1', [req.params.id]);
    
    if (professor_id) {
      await pool.query(
        'INSERT INTO professor_disciplina (professor_id, disciplina_id) VALUES ($1, $2)',
        [professor_id, req.params.id]
      );
    }

    res.json({ mensagem: 'Disciplina e vínculos atualizados!', disciplina: result.rows[0] });
  } catch (err) {
    console.error(err);
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
