const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const User = require('./src/models/User');
const Account = require('./src/models/Account');
const Company = require('./src/models/Company');
const LearningContent = require('./src/models/LearningContent');

const companiesData = [
  { name: 'Tata Consultancy Services', symbol: 'TCS', exchange: 'NSE', sector: 'IT Services', price: 3420, change: 40.20, changePercent: 1.20, description: 'TCS is an Indian multinational information technology services and consulting company.', status: 'ACTIVE' },
  { name: 'Infosys', symbol: 'INFY', exchange: 'NSE', sector: 'IT Services', price: 1520, change: -5.50, changePercent: -0.36, description: 'Infosys is a global leader in next-generation digital services and consulting.', status: 'ACTIVE' },
  { name: 'Reliance Industries', symbol: 'RELIANCE', exchange: 'NSE', sector: 'Conglomerate', price: 2950, change: 15.00, changePercent: 0.51, description: 'Reliance Industries Limited is an Indian multinational conglomerate.', status: 'ACTIVE' },
  { name: 'HDFC Bank', symbol: 'HDFCBANK', exchange: 'NSE', sector: 'Banking', price: 1650, change: 20.00, changePercent: 1.22, description: 'HDFC Bank Limited is an Indian banking and financial services company.', status: 'ACTIVE' },
  { name: 'ICICI Bank', symbol: 'ICICIBANK', exchange: 'NSE', sector: 'Banking', price: 1050, change: 10.00, changePercent: 0.96, description: 'ICICI Bank is a leading private sector bank in India.', status: 'ACTIVE' },
  { name: 'State Bank of India', symbol: 'SBIN', exchange: 'NSE', sector: 'Banking', price: 650, change: 5.00, changePercent: 0.77, description: 'SBI is an Indian multinational, public sector banking and financial services statutory body.', status: 'ACTIVE' },
  { name: 'ITC Limited', symbol: 'ITC', exchange: 'NSE', sector: 'FMCG', price: 420, change: -2.00, changePercent: -0.47, description: 'ITC Limited is an Indian multinational conglomerate company.', status: 'ACTIVE' },
  { name: 'Wipro', symbol: 'WIPRO', exchange: 'NSE', sector: 'IT Services', price: 480, change: 8.00, changePercent: 1.69, description: 'Wipro Limited is a leading global information technology, consulting and business process services company.', status: 'ACTIVE' },
  { name: 'Bharti Airtel', symbol: 'BHARTIARTL', exchange: 'NSE', sector: 'Telecommunications', price: 1100, change: 12.00, changePercent: 1.10, description: 'Bharti Airtel is an Indian global telecommunications services company.', status: 'ACTIVE' },
  { name: 'Tata Motors', symbol: 'TATAMOTORS', exchange: 'NSE', sector: 'Automotive', price: 950, change: 25.00, changePercent: 2.70, description: 'Tata Motors Limited is an Indian multinational automotive manufacturing company.', status: 'ACTIVE' },
];

const learningData = [
  { title: 'Understanding Market Capitalization', category: 'Stock Market Basics', description: 'Learn how market cap works and why it matters.', content: "Market capitalization is the total value of all a company's shares of stock.", difficulty: 'BEGINNER', status: 'PUBLISHED' },
  { title: 'How Stock Prices Move', category: 'Stock Market Basics', description: 'Understand supply, demand, and market forces.', content: 'Stock prices move primarily due to supply and demand forces in the market.', difficulty: 'BEGINNER', status: 'PUBLISHED' },
  { title: 'Basics of Fundamental Analysis', category: 'Fundamental Analysis', description: "Learn to evaluate a company's intrinsic value.", content: 'Fundamental analysis involves examining related economic and financial factors.', difficulty: 'INTERMEDIATE', status: 'PUBLISHED' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-trading');
    console.log('MongoDB Connected for Seeding');

    await User.deleteMany();
    await Account.deleteMany();
    await Company.deleteMany();
    await LearningContent.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedUserPassword = await bcrypt.hash('user123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@smarttrading.com',
      password: hashedAdminPassword,
      role: 'ADMIN'
    });

    const user = await User.create({
      name: 'Demo Trader',
      email: 'user@smarttrading.com',
      password: hashedUserPassword,
      role: 'TRADER'
    });

    await Account.create({
      userId: user._id,
      virtualBalance: 100000
    });

    await Company.insertMany(companiesData);
    await LearningContent.insertMany(learningData);

    console.log('Database Seeded Successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
