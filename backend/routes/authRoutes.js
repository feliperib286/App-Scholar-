// Exemplo de como deve ficar a rota de auth
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/primeiro-acesso', authController.trocarSenhaPrimeiroAcesso);

module.exports = router;
