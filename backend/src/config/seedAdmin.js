const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Admin = require("../models/Admin");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await Admin.deleteMany({});

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      email: "admin@lifedesigner.com",
      password: hashedPassword,
    });

    console.log("Admin seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
