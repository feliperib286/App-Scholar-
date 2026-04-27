const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/notasController');
const { autenticar } = require('../controllers/authController');

// GET /api/boletim/:matricula
router.get('/boletim/:matricula', autenticar, ctrl.getBoletim);

// GET /api/notas
router.get('/', autenticar, ctrl.listar);

// POST /api/notas
router.post('/', autenticar, ctrl.lancarNota);

module.exports = router;
