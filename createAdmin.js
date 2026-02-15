require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const createAdmin = async () => {
    try {
        // Connect to DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            console.log("Admin credentials missing in .env file");
            process.exit(1);
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // Create admin
        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created successfully!");
        console.log(`Email: ${admin.email}`);
        console.log("Role: admin");

        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();
