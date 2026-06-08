const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notasController'); // O controlador que você criou acima
const { autenticar } = require('../controllers/authController');

// Agora tudo está centralizado e organizado
router.get('/boletim/:matricula', autenticar, ctrl.getBoletim);
router.post('/', autenticar, ctrl.lancarNota);

module.exports = router;