const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, updateUserStatus, getTradingActivity, getUserDetails, updateUserRole } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);
router.get('/trading-activity', getTradingActivity);

module.exports = router;