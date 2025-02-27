const express = require("express");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rdpatel11124@gmail.com",
    pass: "ldzy rwur lxab zwcr",
  },
});

// **Add User Route (Admin Only)**
router.post("/add-user", async (req, res) => {
  const { name, email, password, parent_Id } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.name === name
            ? "Username already exists"
            : "Email already exists",
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "user",
      signup: "trainer",
      parent_Id: parent_Id,
    });
    await newUser.save();

    // Define Email Content
    const mailOptions = {
      from: "rdpatel11124@gmail.com",
      to: email,
      subject: "Welcome to Our Platform",
      html: `<p>Hello <b>${name}</b>,</p>
           <p>Your account has been successfully created.</p>
           <p><b>Email:</b> ${email}</p>
           <p><b>Password:</b> ${password}</p>
           <p>You can now log in using the credentials above.</p>
           <p>
          <a href="http://localhost:3000/login" 
             style="display: inline-block; padding: 10px 20px; font-size: 16px; 
             color: #fff; background-color: #007BFF; text-decoration: none; 
             border-radius: 5px;">
             Login Now
          </a>
        </p>
           <p>Best Regards,</p>
           <p>Team</p>`,
    };

    // Send Email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email sending failed:", err);
        return res.status(500).json({
          success: false,
          message: "Email sending failed",
          error: err,
        });
      }
      console.log("Email sent successfully:", info.response);
      return res.json({
        success: true,
        message: "User added successfully and email sent",
      });
    });

    res.json({ success: true, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// **Fetch all users except admin**
router.get("/users", async (req, res) => {
  try {
    // Extract query params with default values
    const {
      status = "All",
      page = 0,
      limit = 10,
      search,
      trainerId,
    } = req.query;

    const filter = { role: "user", parent_Id: trainerId }; // Fetch only users, not admins

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.length >= 3) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { password: { $regex: search, $options: "i" } },
      ];
    }

    // Ensure numeric values and prevent negative/zero values
    const pageNumber = Math.max(parseInt(page, 10) || 0, 0);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = pageNumber * limitNumber;

    // Get total users count
    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter).skip(skip).limit(limitNumber);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalUsers / limitNumber),
        totalUsers,
        hasNextPage: pageNumber * limitNumber < totalUsers,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// **Fetch Admin by ID**
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user || user.role !== "user") {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Delete User
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// **Update User Route (Admin Only)**
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, status },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
