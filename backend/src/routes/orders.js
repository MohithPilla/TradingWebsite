const express = require('express');
const router = express.Router();
const { buyStock, sellStock, getOrders } = require('../controllers/tradingController');
const { protect } = require('../middleware/auth');

router.post('/buy', protect, buyStock);
router.post('/sell', protect, sellStock);
router.get('/', protect, getOrders);

module.exports = router;