require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/appointments_db');
    
    const users = await User.find({}).select('+password');
    console.log('ALL USERS:');
    users.forEach(u => {
        console.log(`Email: ${u.email}, HashLength: ${u.password ? u.password.length : 'MISSING'}, Role: ${u.role}`);
    });
    
    // Test login attempt
    const chhavi = users.find(u => u.email === 'chhavi56@gmail.com');
    if (chhavi) {
        console.log('Comparing against standard password123? : ', await chhavi.comparePassword('password123'));
    }
    
    process.exit(0);
}
test();
