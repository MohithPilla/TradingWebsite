const Portfolio = require('../models/Portfolio');
const Account = require('../models/Account');
const Company = require('../models/Company');

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.user.id }).populate('companyId');
    let investedValue = 0;
    let currentValue = 0;
    
    const enhancedPortfolio = portfolio.map(item => {
      if(!item.companyId) return null; // Safe guard
      const currVal = item.quantity * item.companyId.price;
      const invVal = item.quantity * item.averagePrice;
      investedValue += invVal;
      currentValue += currVal;
      return {
        _id: item._id,
        company: item.companyId,
        quantity: item.quantity,
        averagePrice: item.averagePrice,
        currentPrice: item.companyId.price,
        currentValue: currVal,
        investedValue: invVal,
        profitLoss: currVal - invVal,
        profitLossPercent: ((currVal - invVal) / invVal) * 100
      };
    }).filter(item => item !== null);

    res.json({ success: true, data: enhancedPortfolio });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getPortfolioSummary = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user.id });
    const portfolio = await Portfolio.find({ userId: req.user.id }).populate('companyId');
    
    let investedAmount = 0;
    let currentPortfolioValue = 0;
    
    portfolio.forEach(item => {
      if(item.companyId) {
        investedAmount += item.quantity * item.averagePrice;
        currentPortfolioValue += item.quantity * item.companyId.price;
      }
    });

    const totalPL = currentPortfolioValue - investedAmount;

    res.json({
      success: true,
      data: {
        availableBalance: account.virtualBalance,
        investedAmount,
        portfolioValue: currentPortfolioValue,
        totalValue: account.virtualBalance + currentPortfolioValue,
        totalProfitLoss: totalPL
      }
    });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};