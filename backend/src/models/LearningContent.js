const mongoose = require('mongoose');

const learningContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  difficulty: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], default: 'BEGINNER' },
  thumbnail: { type: String },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'PUBLISHED' },
}, { timestamps: true });

module.exports = mongoose.model('LearningContent', learningContentSchema);