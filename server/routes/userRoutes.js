const express = require("express");
const User = require("../models/User");
const { verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

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
router.put("/:id", verifyAdmin, async (req, res) => {
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
