const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Ruta para registrar ventas
router.post('/register', salesController.addNewSale)

// Ruta para obtener el conjunto de clientes que han comprado en una sucursal específica
router.get('/consultar/:sucursalId', salesController.getClientBranch)

//Ruta para obtener todo
router.get('/all', salesController.getAll)

module.exports = router;