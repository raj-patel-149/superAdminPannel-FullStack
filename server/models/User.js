const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["superadmin", "admin", "trainer", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    signup: { type: String, enum: ["superadmin", "admin", "trainer", "user"] },
    parent_Id: { type: mongoose.Schema.Types.ObjectId, ref: "emps" },
    user_Status: {
      type: String,
      enum: ["Email sent", "Email accepted", "Password not set", "verified"],
      required: function () {
        return this.role === "user"; // Only required when role is 'user'
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("emps", userSchema);

module.exports = User;
