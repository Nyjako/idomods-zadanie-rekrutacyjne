const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// Pobranie wszystkich zamówień CSV
router.get('/', ordersController.getOrdersCSV);

// Pobranie po orderID
router.get('/:orderID', ordersController.getOrder);

module.exports = router;