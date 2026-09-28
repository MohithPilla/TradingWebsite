const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWatchlist);
router.post('/:companyId', protect, addToWatchlist);
router.delete('/:companyId', protect, removeFromWatchlist);

module.exports = router;