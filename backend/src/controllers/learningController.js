const LearningContent = require('../models/LearningContent');

exports.getLearningContent = async (req, res) => {
  try {
    const content = await LearningContent.find({ status: 'PUBLISHED' }).populate('companyId', 'name symbol');
    res.json({ success: true, data: content });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getArticle = async (req, res) => {
  try {
    const article = await LearningContent.findById(req.params.id).populate('companyId', 'name symbol');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, data: article });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.searchLearning = async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, 'i');
    const content = await LearningContent.find({
      status: 'PUBLISHED',
      $or: [{ title: regex }, { category: regex }, { description: regex }]
    });
    res.json({ success: true, data: content });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

// Admin Routes
exports.createLearningContent = async (req, res) => {
  try {
    const content = await LearningContent.create(req.body);
    res.status(201).json({ success: true, data: content });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.updateLearningContent = async (req, res) => {
  try {
    const content = await LearningContent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.json({ success: true, data: content });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.deleteLearningContent = async (req, res) => {
  try {
    const content = await LearningContent.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.json({ success: true, message: 'Content deleted' });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};