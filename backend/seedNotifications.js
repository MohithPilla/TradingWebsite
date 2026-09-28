const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');
const Notification = require('./src/models/Notification');

const seedNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-trading');
    console.log('Connected to DB');

    const users = await User.find();
    
    for (let user of users) {
      await Notification.insertMany([
        {
          userId: user._id,
          message: 'Welcome to Smart Trading! Thank you for joining our platform. Start exploring the market and learning to trade.',
          type: 'SYSTEM',
          isRead: false
        },
        {
          userId: user._id,
          message: 'Market Volatility Alert: The market is experiencing high volatility today. Trade carefully.',
          type: 'SYSTEM',
          isRead: false
        }
      ]);
    }
    
    console.log('Notifications seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedNotifications();
