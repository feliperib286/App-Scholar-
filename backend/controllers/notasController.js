const pool = require('../database/db');

// ==========================================
// GET /api/boletim/:matricula
// ==========================================
async function getBoletim(req, res) {
  const { matricula } = req.params;

  try {
    const alunoResult = await pool.query(
      'SELECT * FROM alunos WHERE matricula = $1',
      [matricula]
    );

    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }

    const aluno = alunoResult.rows[0];

    // Atualizado para trazer as faltas e o tipo de falta
    const notasResult = await pool.query(
      `SELECT
         n.id,
         d.nome  AS disciplina,
         d.semestre,
         d.carga_horaria,
         p.nome  AS professor,
         n.nota1,
         n.nota2,
         n.media,
         n.situacao,
         n.faltas,
         n.tipo_falta
       FROM notas n
       JOIN disciplinas d ON n.disciplina_id = d.id
       LEFT JOIN professores p ON d.professor_id = p.id
       WHERE n.aluno_id = $1
       ORDER BY d.nome ASC`,
      [aluno.id]
    );

    res.json({
      aluno:      aluno.nome,
      matricula:  aluno.matricula,
      curso:      aluno.curso,
      disciplinas: notasResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar boletim.' });
  }
}

// ==========================================
// GET /api/notas
// ==========================================
async function listar(req, res) {
  try {
    const result = await pool.query(
      `SELECT n.*, a.nome AS aluno_nome, a.matricula, d.nome AS disciplina_nome
       FROM notas n
       JOIN alunos a ON n.aluno_id = a.id
       JOIN disciplinas d ON n.disciplina_id = d.id
       ORDER BY a.nome, d.nome`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar notas.' });
  }
}

// ==========================================
// POST /api/notas - Lançamento Completo
// ==========================================
async function lancarNota(req, res) {
  const idProfessor = req.user.id; 
  // Agora recebemos as duas notas e as faltas
  const { aluno_id, disciplina_id, nota1, nota2, faltas, tipo_falta } = req.body;

  if (!aluno_id || !disciplina_id) {
    return res.status(400).json({ erro: 'aluno_id e disciplina_id são obrigatórios.' });
  }

  try {
    const verificaDisciplina = await pool.query(
      'SELECT * FROM professor_disciplina WHERE professor_id = $1 AND disciplina_id = $2',
      [idProfessor, disciplina_id]
    );

    if (verificaDisciplina.rows.length === 0 && req.user.role !== 'adm') {
      return res.status(403).json({ erro: 'Você não tem permissão para lançar notas nesta disciplina.' });
    }

    // Calcula a média garantindo que não dê erro se o valor vier vazio
    const n1 = parseFloat(nota1) || 0;
    const n2 = parseFloat(nota2) || 0;
    const media = parseFloat(((n1 + n2) / 2).toFixed(2));
    const situacao = media >= 6 ? 'Aprovado' : media >= 4 ? 'Rec. Final' : 'Reprovado';
    
    // Formata as faltas para garantir que é um número inteiro
    const qtdFaltas = parseInt(faltas) || 0;
    const tipo = tipo_falta || 'Comum';

    const result = await pool.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao, faltas, tipo_falta)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (aluno_id, disciplina_id)
       DO UPDATE SET nota1=$3, nota2=$4, media=$5, situacao=$6, faltas=$7, tipo_falta=$8
       RETURNING *`,
      [aluno_id, disciplina_id, n1, n2, media, situacao, qtdFaltas, tipo]
    );

    res.status(201).json({
      mensagem: 'Registro acadêmico atualizado com sucesso!',
      nota: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gravar os dados acadêmicos.' });
  }
}

module.exports = { getBoletim, listar, lancarNota };