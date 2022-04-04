const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const { query } = require('express');
const jwt =  require('jsonwebtoken');
const controllersUsuario = require('../controllers/usuarios-controller');

router.post('/cadastro', controllersUsuario.cadastro);

router.post('/login', controllersUsuario.login);

module.exports = router;