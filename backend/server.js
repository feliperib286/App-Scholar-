require('dotenv').config();

const express = require('express');
const cors = require('cors');

// 1. Defina o app primeiro!
const app = express();

// 2. Middlewares (Obrigatório antes das rotas)
app.use(cors());
app.use(express.json());

// 🟢 ADICIONE ESTE RADAR: Ele vai dedurar TUDO que tentar entrar na sua API
app.use((req, res, next) => {
  console.log(`[RADAR] Detectou: ${req.method} ${req.url}`);
  next();
});

// 3. Importação das Rotas
const authRoutes = require('./routes/authRoutes');
const alunosRoutes = require('./routes/alunosRoutes');
const professoresRoutes = require('./routes/professoresRoutes');
const disciplinasRoutes = require('./routes/disciplinasRoutes');
const notasRoutes = require('./routes/notasRoutes');
const avisosRoutes = require('./routes/avisosRoutes'); // Sua nova rota

// 4. Configuração das Rotas (Aqui o app já está definido, então funciona)
app.use('/api', authRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api', notasRoutes);
app.use('/api/avisos', avisosRoutes); // Agora funciona!

// ── Rota de teste ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    app: 'App Scholar API',
    status: 'online',
  });
});

// ── Inicia servidor ────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});