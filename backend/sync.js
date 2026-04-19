require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

async function sync() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/appointments_db');
    console.log('Connected to DB');

    const users = await User.find({ role: { $in: ['Doctor', 'doctor'] } });
    let synced = 0;
    
    for (const u of users) {
        const existingDoc = await Doctor.findOne({ user: u._id });
        if (!existingDoc) {
             await Doctor.create({
                user: u._id,
                specialization: 'Legacy Registered Practitioner',
                fee: 100,
                bio: 'Migrated legacy account.',
                availableSlots: []
             });
             synced++;
        }
    }
    console.log(`Successfully migrated ${synced} legacy doctors into the Doctor schema!`);
    process.exit(0);
}
sync();
