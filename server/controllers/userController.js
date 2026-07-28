import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

// =======================
// Register User
// =======================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// =======================
// Login User
// =======================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// =======================
// Get Profile
// =======================
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile Fetched Successfully",
    user,
  });
});

// =======================
// Update Profile
// =======================
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Check email duplication
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
  }

  user.name = name || user.name;
  user.email = email || user.email;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// =======================
// Get All Users
// =======================
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// =======================
// Get User By ID
// =======================
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// =======================
// Update User
// =======================
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Prevent duplicate email
  if (
    req.body.email &&
    req.body.email !== user.email
  ) {
    const emailExists = await User.findOne({
      email: req.body.email,
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;

  if (req.body.password) {
    user.password = await bcrypt.hash(
      req.body.password,
      10
    );
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// =======================
// Change Password
// =======================
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Check current password
  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  // Prevent using the same password
  const samePassword = await bcrypt.compare(
    newPassword,
    user.password
  );

  if (samePassword) {
    return res.status(400).json({
      success: false,
      message:
        "New password must be different from current password",
    });
  }

  // Optional: Minimum password length
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 6 characters long",
    });
  }

  // Hash new password
  user.password = await bcrypt.hash(
    newPassword,
    10
  );

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// =======================
// Delete User
// =======================
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(
    req.params.id
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});