const express = require('express');
const router = express.Router();
const { getCompanies, getCompany, searchCompanies, getAllCompanies, createCompany, updateCompany, deleteCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/search', searchCompanies);
router.get('/', getCompanies);
router.get('/:id', getCompany);

// Admin
router.get('/admin/all', protect, authorize('ADMIN'), getAllCompanies);
router.post('/', protect, authorize('ADMIN'), createCompany);
router.put('/:id', protect, authorize('ADMIN'), updateCompany);
router.delete('/:id', protect, authorize('ADMIN'), deleteCompany);

module.exports = router;