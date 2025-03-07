const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // Import your MongoDB connection
const User = require("./models/User"); // Adjust the path to your User model

async function hashPasswords() {
  try {
    // Connect to MongoDB Atlas
    await connectDB();

    // Fetch all users from the database
    const users = await User.find();

    for (let user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2b$ or $2a$)
      if (
        !user.password.startsWith("$2b$") &&
        !user.password.startsWith("$2a$") &&
        user.role !== "user"
      ) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        console.log(`✅ Updated password for user: ${user.email}`);
      } else {
        console.log(`🔹 Password already hashed for user: ${user.email}`);
      }
    }

    console.log("🎉 All passwords updated successfully!");
  } catch (error) {
    console.error("❌ Error updating passwords:", error);
  } finally {
    // Close the MongoDB connection after completion
    mongoose.connection.close();
  }
}

// Run the script
hashPasswords();
