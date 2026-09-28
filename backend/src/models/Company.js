const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true, unique: true },
  exchange: { type: String, required: true },
  sector: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 },
  marketCap: { type: Number },
  high52Week: { type: Number },
  low52Week: { type: Number },
  volume: { type: Number, default: 0 },
  description: { type: String },
  history: { type: String },
  foundedYear: { type: Number },
  headquarters: { type: String },
  ceo: { type: String },
  logo: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);