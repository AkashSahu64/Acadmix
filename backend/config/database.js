const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Make sure this line exists
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);

    // Seed demo accounts after connection
    await seedDemoAccounts();
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

const seedDemoAccounts = async () => {
  try {
    const demoAccounts = [
      {
        email: "admin@example.com",
        defaults: {
          name: "Admin",
          password: bcrypt.hashSync("Admin123", 10), // bcrypt now available
          role: "admin",
          isVerified: true
        }
      },
      {
        email: "teacher@example.com",
        defaults: {
          name: "Teacher",
          password: bcrypt.hashSync("Teacher123", 10), // bcrypt now available
          role: "teacher",
          isVerified: true
        }
      }
    ];

    for (const account of demoAccounts) {
      await User.findOneAndUpdate(
        { email: account.email },
        account.defaults,
        { upsert: true, new: true }
      );
    }
    console.log("✅ Demo accounts checked/created");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
  }
};

module.exports = { connectDB };