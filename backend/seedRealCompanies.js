const mongoose = require('mongoose');
require('dotenv').config();
const Company = require('./src/models/Company');

const seedRealCompanies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-trading');
    console.log('Connected to DB');

    const realCompanies = [
      // Technology
      { name: 'Apple Inc.', symbol: 'AAPL', sector: 'Technology', exchange: 'NASDAQ' },
      { name: 'Microsoft Corporation', symbol: 'MSFT', sector: 'Technology', exchange: 'NASDAQ' },
      { name: 'Alphabet Inc. (Google)', symbol: 'GOOGL', sector: 'Technology', exchange: 'NASDAQ' },
      { name: 'Amazon.com Inc.', symbol: 'AMZN', sector: 'Technology', exchange: 'NASDAQ' },
      { name: 'Meta Platforms Inc.', symbol: 'META', sector: 'Technology', exchange: 'NASDAQ' },
      { name: 'NVIDIA Corporation', symbol: 'NVDA', sector: 'Technology', exchange: 'NASDAQ' },
      { name: 'Tesla Inc.', symbol: 'TSLA', sector: 'Automotive', exchange: 'NASDAQ' },
      { name: 'Netflix Inc.', symbol: 'NFLX', sector: 'Technology', exchange: 'NASDAQ' },
      { name: 'Intel Corporation', symbol: 'INTC', sector: 'Technology', exchange: 'NASDAQ' },
      { name: 'Advanced Micro Devices', symbol: 'AMD', sector: 'Technology', exchange: 'NASDAQ' },
      
      // Indian Stocks (NSE/BSE)
      { name: 'Reliance Industries', symbol: 'RELIANCE', sector: 'Energy', exchange: 'NSE' },
      { name: 'Tata Consultancy Services', symbol: 'TCS', sector: 'Technology', exchange: 'NSE' },
      { name: 'HDFC Bank Limited', symbol: 'HDFCBANK', sector: 'Finance', exchange: 'NSE' },
      { name: 'Infosys Limited', symbol: 'INFY', sector: 'Technology', exchange: 'NSE' },
      { name: 'ICICI Bank Limited', symbol: 'ICICIBANK', sector: 'Finance', exchange: 'NSE' },
      { name: 'State Bank of India', symbol: 'SBIN', sector: 'Finance', exchange: 'NSE' },
      { name: 'Bharti Airtel', symbol: 'BHARTIARTL', sector: 'Telecommunication', exchange: 'NSE' },
      { name: 'ITC Limited', symbol: 'ITC', sector: 'Consumer Goods', exchange: 'NSE' },
      { name: 'Larsen & Toubro', symbol: 'LT', sector: 'Industrial', exchange: 'NSE' },
      { name: 'Bajaj Finance', symbol: 'BAJFINANCE', sector: 'Finance', exchange: 'NSE' },
      { name: 'Asian Paints', symbol: 'ASIANPAINT', sector: 'Consumer Goods', exchange: 'NSE' },
      { name: 'HCL Technologies', symbol: 'HCLTECH', sector: 'Technology', exchange: 'NSE' },
      { name: 'Tata Motors', symbol: 'TATAMOTORS', sector: 'Automotive', exchange: 'NSE' },
      { name: 'Mahindra & Mahindra', symbol: 'M&M', sector: 'Automotive', exchange: 'NSE' },
      { name: 'Maruti Suzuki', symbol: 'MARUTI', sector: 'Automotive', exchange: 'NSE' },
      { name: 'Sun Pharmaceutical', symbol: 'SUNPHARMA', sector: 'Healthcare', exchange: 'NSE' },
      { name: 'Wipro Limited', symbol: 'WIPRO', sector: 'Technology', exchange: 'NSE' },
      { name: 'Axis Bank', symbol: 'AXISBANK', sector: 'Finance', exchange: 'NSE' },
      { name: 'Kotak Mahindra Bank', symbol: 'KOTAKBANK', sector: 'Finance', exchange: 'NSE' },
      { name: 'Titan Company', symbol: 'TITAN', sector: 'Consumer Goods', exchange: 'NSE' },

      // Finance & Healthcare (Global)
      { name: 'JPMorgan Chase & Co.', symbol: 'JPM', sector: 'Finance', exchange: 'NYSE' },
      { name: 'Visa Inc.', symbol: 'V', sector: 'Finance', exchange: 'NYSE' },
      { name: 'Mastercard Inc.', symbol: 'MA', sector: 'Finance', exchange: 'NYSE' },
      { name: 'Johnson & Johnson', symbol: 'JNJ', sector: 'Healthcare', exchange: 'NYSE' },
      { name: 'UnitedHealth Group', symbol: 'UNH', sector: 'Healthcare', exchange: 'NYSE' },
      { name: 'Pfizer Inc.', symbol: 'PFE', sector: 'Healthcare', exchange: 'NYSE' },
      { name: 'Eli Lilly and Company', symbol: 'LLY', sector: 'Healthcare', exchange: 'NYSE' },
      { name: 'AbbVie Inc.', symbol: 'ABBV', sector: 'Healthcare', exchange: 'NYSE' },
      { name: 'Bank of America', symbol: 'BAC', sector: 'Finance', exchange: 'NYSE' },
      
      // Consumer Goods & Retail
      { name: 'Walmart Inc.', symbol: 'WMT', sector: 'Retail', exchange: 'NYSE' },
      { name: 'Procter & Gamble', symbol: 'PG', sector: 'Consumer Goods', exchange: 'NYSE' },
      { name: 'The Coca-Cola Company', symbol: 'KO', sector: 'Consumer Goods', exchange: 'NYSE' },
      { name: 'PepsiCo Inc.', symbol: 'PEP', sector: 'Consumer Goods', exchange: 'NASDAQ' },
      { name: 'McDonald\'s Corporation', symbol: 'MCD', sector: 'Consumer Goods', exchange: 'NYSE' },
      { name: 'Nike Inc.', symbol: 'NKE', sector: 'Consumer Goods', exchange: 'NYSE' },
      { name: 'Starbucks Corporation', symbol: 'SBUX', sector: 'Consumer Goods', exchange: 'NASDAQ' },
      { name: 'Target Corporation', symbol: 'TGT', sector: 'Retail', exchange: 'NYSE' },

      // Energy & Industrials
      { name: 'Exxon Mobil Corporation', symbol: 'XOM', sector: 'Energy', exchange: 'NYSE' },
      { name: 'Chevron Corporation', symbol: 'CVX', sector: 'Energy', exchange: 'NYSE' },
      { name: 'Boeing Company', symbol: 'BA', sector: 'Industrial', exchange: 'NYSE' },
      { name: 'Caterpillar Inc.', symbol: 'CAT', sector: 'Industrial', exchange: 'NYSE' },
      { name: 'General Electric', symbol: 'GE', sector: 'Industrial', exchange: 'NYSE' },
      { name: '3M Company', symbol: 'MMM', sector: 'Industrial', exchange: 'NYSE' }
    ];

    const companiesToInsert = realCompanies.map(c => {
      const basePrice = Math.floor(Math.random() * 8000) + 100;
      return {
        ...c,
        description: `${c.name} is a leading entity operating in the ${c.sector} sector, traded on the ${c.exchange}.`,
        price: basePrice,
        high52Week: basePrice + Math.random() * 500,
        low52Week: basePrice - Math.random() * 500,
        marketCap: Math.floor(Math.random() * 500000000000) + 1000000000,
        change: 0,
        changePercent: 0,
        history: `Established as a dominant force in ${c.sector}.`,
        foundedYear: 1900 + Math.floor(Math.random() * 100),
        headquarters: 'Global',
        ceo: 'Board of Directors'
      };
    });

    await Company.deleteMany({});
    await Company.insertMany(companiesToInsert);
    
    console.log(`${companiesToInsert.length} Real Companies seeded successfully!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedRealCompanies();
