const mongoose = require('mongoose');
require('dotenv').config();
const Company = require('./src/models/Company');

const seedCompanies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-trading');
    console.log('Connected to DB');

    const companies = [];
    for (let i = 1; i <= 100; i++) {
      const basePrice = Math.floor(Math.random() * 5000) + 50;
      companies.push({
        name: `Company ${i} Ltd`,
        symbol: `COMP${i}`,
        exchange: ['NSE', 'BSE'][Math.floor(Math.random() * 2)],
        description: `This is a mock description for Company ${i}, representing a prominent entity in its respective industry.`,
        price: basePrice,
        high52Week: basePrice + Math.random() * 50,
        low52Week: basePrice - Math.random() * 50,
        marketCap: Math.floor(Math.random() * 100000000000),
        sector: ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer Goods'][Math.floor(Math.random() * 5)],
        change: 0,
        changePercent: 0,
        history: `Company ${i} has a rich history of innovation.`,
        foundedYear: 1980 + Math.floor(Math.random() * 40),
        headquarters: 'Mumbai, India',
        ceo: `CEO ${i}`,
      });
    }

    await Company.deleteMany({});
    await Company.insertMany(companies);
    
    console.log('100 Companies seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCompanies();
