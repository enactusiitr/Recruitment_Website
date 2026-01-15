const mongoose = require('mongoose');
require('dotenv').config();

const Notice = require('./models/Notice');
const Club = require('./models/Club');
const Event = require('./models/Event');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Notice.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});

    // Seed Super Admin User only
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'admin@iitr.ac.in',
      password: 'enactus@sudo123',
      role: 'superadmin',
      club: 'All'
    });
    await superAdmin.save();
    console.log('Super Admin created - Email: admin@iitr.ac.in, Password: enactus@sudo123');

    // No demo club admins, notices, clubs, or events are seeded
    // All data should be created through the SuperAdmin panel

    console.log('Seed data complete - Only Super Admin created');
    console.log('Use the SuperAdmin panel to create clubs and club admins');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
