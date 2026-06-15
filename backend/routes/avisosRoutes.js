const express = require('express');
const router = express.Router();
const avisoController = require('../controllers/avisoController');
const { autenticar } = require('../controllers/authController');

// Rota para listar (todos podem ver)
router.get('/', autenticar, avisoController.listarAvisos);

// Rota para criar (apenas quem estiver autenticado pode criar)
router.post('/', autenticar, avisoController.criarAviso);

module.exports = router;