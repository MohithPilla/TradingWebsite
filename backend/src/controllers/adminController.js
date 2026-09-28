const User = require('../models/User');
const Company = require('../models/Company');
const Order = require('../models/Order');
const Trade = require('../models/Trade');
const LearningContent = require('../models/LearningContent');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'TRADER' });
    const activeUsers = await User.countDocuments({ role: 'TRADER', status: 'ACTIVE' });
    const verifiedUsers = await User.countDocuments({ role: 'TRADER', emailVerified: true });
    const unverifiedUsers = await User.countDocuments({ role: 'TRADER', emailVerified: false });
    
    // Users this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newUsersThisMonth = await User.countDocuments({ role: 'TRADER', createdAt: { $gte: startOfMonth } });

    const totalTrades = await Trade.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Analytics (daily registrations last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const registrationTrends = await User.aggregate([
      { $match: { role: 'TRADER', createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    const buyTrades = await Trade.countDocuments({ type: 'BUY' });
    const sellTrades = await Trade.countDocuments({ type: 'SELL' });

    res.json({
      success: true,
      data: {
        stats: { totalUsers, activeUsers, verifiedUsers, unverifiedUsers, totalTrades, totalOrders, newUsersThisMonth },
        analytics: {
          registrationTrends,
          transactions: { buy: buyTrades, sell: sellTrades },
          userActivity: { active: activeUsers, inactive: totalUsers - activeUsers }
        }
      }
    });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getUsers = async (req, res) => {
  try {
    const { search, status, verified, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;
    if (verified) query.emailVerified = verified === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await User.countDocuments(query);

    res.json({ success: true, data: users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    const trades = await Trade.countDocuments({ userId: user._id });
    
    res.json({ success: true, data: { ...user._doc, totalTrades: trades } });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, message: 'Cannot change own role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getTradingActivity = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    let query = {};
    
    // search not easily joined without aggregation in mongoose, keeping it simple
    const trades = await Trade.find(query)
      .populate('userId', 'name email')
      .populate('companyId', 'symbol name')
      .sort('-executedAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await Trade.countDocuments(query);
    
    res.json({ success: true, data: trades, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};