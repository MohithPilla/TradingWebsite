const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  quantity: { type: Number, required: true, default: 0 },
  averagePrice: { type: Number, required: true },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);