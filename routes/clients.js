const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Ruta para añadir un nuevo cliente
router.post('/add', clientController.addNewClient);
//router.get('/:RFC', productController.getProductDetails)
   
module.exports = router;