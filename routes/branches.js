const express = require('express');
const router = express.Router();
const branchesController = require('../controllers/branchesController');
   
// Ruta para obtener los datos de la sucursal
router.get('/nearby', branchesController.findNearbyBranches)

module.exports = router;