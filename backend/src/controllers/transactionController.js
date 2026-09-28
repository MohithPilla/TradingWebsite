const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .populate({ path: 'orderId', populate: { path: 'companyId', select: 'name symbol' }})
      .sort('-createdAt');
    res.json({ success: true, data: transactions });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};