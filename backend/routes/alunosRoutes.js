const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosController');
const { autenticar } = require('../controllers/authController'); // Importa o seu middleware

// Rotas do painel exclusivo do Aluno (usam o Token do login para saber quem é)
router.get('/meu-boletim', autenticar, alunosController.consultarMeuBoletim);
router.get('/minha-grade', autenticar, alunosController.consultarMinhaGrade);

// Rotas padrão do CRUD (Apenas Admins gerenciam, mas a rota PUT permite o próprio aluno atualizar se autenticado)
router.get('/', autenticar, alunosController.listar);
router.get('/:id', autenticar, alunosController.buscarPorId);
router.post('/', autenticar, alunosController.criar);
router.put('/:id', autenticar, alunosController.atualizar); // <-- Possui a trava inteligente interna
router.delete('/:id', alunosController.remover);
module.exports = router;