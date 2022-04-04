const { response } = require('express');
const express = require('express');
const { restart } = require('nodemon');
const router = express.Router()
const mysql = require('../mysql').pool;
const pedidosController = require('../controllers/pedidos-controller');

router.get('/', pedidosController.getPedido);

router.post('/', pedidosController.postPedido);

router.get('/:id_pedido', pedidosController.getPedidos);
 
router.patch('/', pedidosController.patchPedido);

router.delete('/', pedidosController.deletePedido);

module.exports = router