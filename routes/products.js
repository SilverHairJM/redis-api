const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
   
// Ruta para dos parametros id producto y num. sucursal
router.get('/:productId', productController.getProductDetails)
//router.get('/:productId/sucursal/:sucursalId', productController.getProductDetails);
   
module.exports = router;