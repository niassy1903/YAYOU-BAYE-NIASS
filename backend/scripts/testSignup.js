const connectDB = require('../config/db');
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();
    const user = new User({ name: 'Test', email: 't2@test.com', password: '123456' });
    console.log('Saving user...');
    await user.save();
    console.log('Saved.');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error caught:', err);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
})();
