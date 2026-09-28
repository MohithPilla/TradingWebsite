const Order = require('../models/Order');
const Trade = require('../models/Trade');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Portfolio = require('../models/Portfolio');
const Notification = require('../models/Notification');
const Company = require('../models/Company');

exports.buyStock = async (req, res) => {
  try {
    const { companyId, quantity } = req.body;
    const company = await Company.findById(companyId);
    if (!company || company.status !== 'ACTIVE') return res.status(404).json({ success: false, message: 'Company not found or inactive' });

    const price = company.price;
    const totalAmount = price * quantity;
    
    const account = await Account.findOne({ userId: req.user.id });
    if (account.virtualBalance < totalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient virtual balance' });
    }

    account.virtualBalance -= totalAmount;
    await account.save();

    const order = await Order.create({
      userId: req.user.id, companyId, type: 'BUY', quantity, price, totalAmount
    });

    await Trade.create({
      orderId: order._id, userId: req.user.id, companyId, type: 'BUY', quantity, price, totalAmount
    });

    await Transaction.create({
      userId: req.user.id, orderId: order._id, type: 'BUY', amount: totalAmount, description: `Bought ${quantity} shares of ${company.symbol}`
    });

    let portfolio = await Portfolio.findOne({ userId: req.user.id, companyId });
    if (portfolio) {
      const totalCost = (portfolio.quantity * portfolio.averagePrice) + totalAmount;
      portfolio.quantity += quantity;
      portfolio.averagePrice = totalCost / portfolio.quantity;
      await portfolio.save();
    } else {
      await Portfolio.create({ userId: req.user.id, companyId, quantity, averagePrice: price });
    }

    await Notification.create({
      userId: req.user.id, message: `Your BUY order for ${quantity} shares of ${company.symbol} was executed successfully.`, type: 'TRADE'
    });

    res.json({ success: true, message: 'Buy order executed successfully' });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.sellStock = async (req, res) => {
  try {
    const { companyId, quantity } = req.body;
    const company = await Company.findById(companyId);
    if (!company || company.status !== 'ACTIVE') return res.status(404).json({ success: false, message: 'Company not found' });

    const price = company.price;
    const totalAmount = price * quantity;

    let portfolio = await Portfolio.findOne({ userId: req.user.id, companyId });
    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient holdings' });
    }

    portfolio.quantity -= quantity;
    if (portfolio.quantity === 0) {
      await Portfolio.findByIdAndDelete(portfolio._id);
    } else {
      await portfolio.save();
    }

    const account = await Account.findOne({ userId: req.user.id });
    account.virtualBalance += totalAmount;
    await account.save();

    const order = await Order.create({
      userId: req.user.id, companyId, type: 'SELL', quantity, price, totalAmount
    });

    await Trade.create({
      orderId: order._id, userId: req.user.id, companyId, type: 'SELL', quantity, price, totalAmount
    });

    await Transaction.create({
      userId: req.user.id, orderId: order._id, type: 'SELL', amount: totalAmount, description: `Sold ${quantity} shares of ${company.symbol}`
    });

    await Notification.create({
      userId: req.user.id, message: `Your SELL order for ${quantity} shares of ${company.symbol} was executed successfully.`, type: 'TRADE'
    });

    res.json({ success: true, message: 'Sell order executed successfully' });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('companyId', 'name symbol').sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};