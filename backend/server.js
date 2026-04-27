require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const authRoutes        = require('./routes/authRoutes');
const alunosRoutes      = require('./routes/alunosRoutes');
const professoresRoutes = require('./routes/professoresRoutes');
const disciplinasRoutes = require('./routes/disciplinasRoutes');
const notasRoutes       = require('./routes/notasRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rotas ──────────────────────────────────────────────────
app.use('/api', authRoutes);          // POST /api/login
app.use('/api/alunos', alunosRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api', notasRoutes);         // GET /api/boletim/:matricula | GET/POST /api/notas

// ── Rota de teste ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    app:     'App Scholar API',
    versao:  '1.0.0',
    status:  'online',
    rotas: [
      'POST /api/login',
      'GET|POST /api/alunos',
      'GET|POST /api/professores',
      'GET|POST /api/disciplinas',
      'GET /api/boletim/:matricula',
      'GET|POST /api/notas',
    ],
  });
});

// ── Inicia servidor ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
