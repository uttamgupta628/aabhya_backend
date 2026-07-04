const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    },
  });
});

// @desc    Get logged-in admin profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
});

// @desc    Create a new admin (superadmin only)
// @route   POST /api/auth/create-admin
// @access  Private/Superadmin
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("An admin with this email already exists");
  }

  const admin = await Admin.create({ name, email, password, role });

  res.status(201).json({
    success: true,
    data: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

module.exports = { loginAdmin, getMe, createAdmin };
