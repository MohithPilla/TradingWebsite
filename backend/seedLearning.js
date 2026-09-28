const mongoose = require('mongoose');
require('dotenv').config();
const LearningContent = require('./src/models/LearningContent');

const seedLearning = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-trading');
    console.log('Connected to DB');

    const contents = [
      {
        title: 'Understanding Market Cap',
        category: 'Stock Market Basics',
        difficulty: 'BEGINNER',
        description: 'Learn what market capitalization means and why it matters.',
        content: 'Market capitalization (market cap) is the total market value of a company\'s outstanding shares of stock. It is calculated by multiplying the total number of a company\'s outstanding shares by the current market price of one share.'
      },
      {
        title: 'How Stock Prices Move',
        category: 'Stock Market Basics',
        difficulty: 'BEGINNER',
        description: 'Understand the basic supply and demand dynamics.',
        content: 'Stock prices change everyday by market forces. By this we mean that share prices change because of supply and demand. If more people want to buy a stock (demand) than sell it (supply), then the price moves up. Conversely, if more people wanted to sell a stock than buy it, there would be greater supply than demand, and the price would fall.'
      },
      {
        title: 'What is a Dividend?',
        category: 'Stock Market Basics',
        difficulty: 'BEGINNER',
        description: 'A quick intro to how companies distribute profits.',
        content: 'A dividend is a distribution of some of a company\'s earnings to a class of its shareholders, as determined by the company\'s board of directors. Common shareholders of dividend-paying companies are typically eligible as long as they own the stock before the ex-dividend date.'
      },
      {
        title: 'Blue Chip Stocks',
        category: 'Investing Strategies',
        difficulty: 'INTERMEDIATE',
        description: 'Investing in large, well-established companies.',
        content: 'A blue-chip stock is a huge company with an excellent reputation. These are typically large, well-established, and financially sound companies that have operated for many years and that have dependable earnings, often paying dividends to investors.'
      },
      {
        title: 'Technical vs Fundamental Analysis',
        category: 'Analysis',
        difficulty: 'ADVANCED',
        description: 'Compare the two main schools of thought in trading.',
        content: 'Fundamental analysis is a method of evaluating a security in an attempt to measure its intrinsic value, by examining related economic, financial and other qualitative and quantitative factors. Technical analysis differs from fundamental analysis in that the stock\'s price and volume are the only inputs.'
      }
    ];

    await LearningContent.deleteMany({});
    await LearningContent.insertMany(contents);
    
    console.log('Learning Content seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedLearning();
