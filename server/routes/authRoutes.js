const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// **Signup Route**
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const newUser = new User({ name, email, password, signup: "user" });
    await newUser.save();

    res.json({ success: true, message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// **Login Route**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist. SignUp Please",
      });
    }
    // Password verification logic based on role
    let isMatch = false;
    isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "This user is inactive. Please contact the admin.",
      });
    }
    if (
      user.role === "user" &&
      user.user_Status !== "verified" &&
      user.password === ""
    ) {
      return res.status(401).json({
        success: false,
        message: "See your mail box and complete the reset password process",
      });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({
      success: true,
      message: "Login successful",
      role: user.role,
      id: user._id,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// **Logout Route**
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
