const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
const bcrypt = require("bcrypt");

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
  const { name, email, parent_Id } = req.body;

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

    const resetToken = jwt.sign({ email: email }, SECRET_KEY, {
      expiresIn: "10m",
    });

    const newUser = new User({
      name,
      email,
      role: "user",
      signup: "trainer",
      password: "",
      parent_Id: parent_Id,
      user_Status: "Email sent",
    });
    await newUser.save();

    const resetUrl = `https://super-admin-pannel-full-stack.vercel.app/reset-password?token=${resetToken}`;
    // Define Email Content
    const mailOptions = {
      from: "rdpatel11124@gmail.com",
      to: email,
      subject: "Welcome to Our Platform",
      html: `<p>Hello <b>${name}</b>,</p>
           <p>Your account has been successfully created.</p>
           <p><b>User Name:</b> ${name}</p>
           <p><b>Email:</b> ${email}</p>
           
           <b>You can now reset your password to verify.</b>
           <p>
             <p>Click below to reset your password:</p>
             <a href="${resetUrl}" 
                style="padding: 10px 20px; background: #28A745; color: white; text-decoration: none;">Accept Invitation</a>
        </p>
           <p>Best Regards,</p>
           <p>Team</p>
            <img src="http://localhost:3001/api/user/accept-email/${email}" width="1" height="1" style="display: none;" />`,
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

// **Handle Forgot Password**
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by ID and update status
    const user = await User.findOne({ email });
    console.log(user);

    const generateRandomPassword = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.user_Status === "Email sent") {
      return res.status(404).json({
        message:
          "Please accept email then you can use forgot password fuctionality",
      });
    }

    const newPassword = generateRandomPassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.user_Status = "verified";

    await user.save();

    // Define Email Content
    const mailOptions = {
      from: "rdpatel11124@gmail.com",
      to: email,
      subject: "Forgot Password Request",
      html: `<p>Hello <b>${user.name}</b>,</p>
           <p>Login using this password.</p>
           <p><b>User Name:</b> ${user.name}</p>
           <p><b>Email:</b> ${email}</p>
           <p><b>Your Password:</b> ${newPassword}</p>
           <p>
             <p>Click below to login:</p>
             <a href="https://super-admin-pannel-full-stack.vercel.app/login" 
                style="padding: 10px 20px; background: #2e99e6; color: white; text-decoration: none;">Login Now</a>
        </p>
           <p>Best Regards,</p>
           <p>Team</p>
            `,
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

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "User does not exist" });
  }
});

// **Handle Email Acceptance**
router.put("/accept-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const email = decoded.email;

    // Find user by ID and update status
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const acceptToken = jwt.sign({ email }, SECRET_KEY, {
      expiresIn: "2m",
    });
    if (user.user_Status !== "verified") {
      user.user_Status = "Email accepted";
    }
    await user.save();

    setTimeout(async () => {
      const expiredUser = await User.findOne({ email });
      if (
        expiredUser &&
        expiredUser.user_Status === "Email accepted" &&
        expiredUser.user_Status !== "verified"
      ) {
        expiredUser.user_Status = "Password not set";
        await expiredUser.save();
        console.log("Password not set");
      }
    }, 1 * 60 * 1000);

    res.json({ message: "Email accepted successfully", user: user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// **Handle Password Reset**
router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Update user password
    user.password = hashedPassword;
    user.user_Status = "verified";
    await user.save();

    return res.json({ message: "Password reset successful!" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
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
// **Fetch user by ID**
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
// **Fetch user by Email**
router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user || user.role !== "user") {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const status = user.user_Status;

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
    // Check if user exists
    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If password is provided, hash it before updating
    let updatedFields = { name, email, status };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

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
