const express = require('express');
const router = express.Router();
const { getLearningContent, getArticle, searchLearning, createLearningContent, updateLearningContent, deleteLearningContent } = require('../controllers/learningController');
const { protect, authorize } = require('../middleware/auth');

router.get('/search', searchLearning);
router.get('/', getLearningContent);
router.get('/:id', getArticle);

// Admin
router.post('/', protect, authorize('ADMIN'), createLearningContent);
router.put('/:id', protect, authorize('ADMIN'), updateLearningContent);
router.delete('/:id', protect, authorize('ADMIN'), deleteLearningContent);

module.exports = router;