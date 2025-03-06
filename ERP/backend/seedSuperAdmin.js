// backend/seedSuperAdmin.js
require('dotenv').config(); // If you're using .env for MONGO_URI, etc.
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust path to your User model

async function seedSuperAdmin() {
  try {
    // 1. Connect to your MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // 2. Check if a SUPER_ADMIN already exists
    const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
    if (existingSuperAdmin) {
      console.log('Super Admin already exists. Skipping creation.');
      return;
    }

    // 3. Create a new Super Admin
    const superAdmin = new User({
      email: 'superadmin@example.com',
      password: bcrypt.hashSync('superpass', 10),
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    await superAdmin.save();

    console.log('Super Admin created:', superAdmin.email);
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
  } finally {
    // 4. Close the DB connection
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedSuperAdmin();
