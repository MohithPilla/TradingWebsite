const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  virtualBalance: { type: Number, default: 100000 },
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);