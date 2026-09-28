require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-trading';

const Company = require('./src/models/Company');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      
      // Stock Price Simulator
      setInterval(async () => {
        try {
          const companies = await Company.find({ status: 'ACTIVE' });
          for (let comp of companies) {
            const changePercent = (Math.random() * 4 - 2); // -2% to +2%
            const changeAmt = comp.price * (changePercent / 100);
            comp.price = Math.max(1, +(comp.price + changeAmt).toFixed(2));
            comp.change = +changeAmt.toFixed(2);
            comp.changePercent = +changePercent.toFixed(2);
            await comp.save();
          }
        } catch (e) {
          console.error('Simulator error', e);
        }
      }, 10000); // Every 10 seconds
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
