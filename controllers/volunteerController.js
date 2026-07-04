const asyncHandler = require("express-async-handler");
const Volunteer = require("../models/Volunteer");
const { deleteCloudinaryAsset } = require("../utils/cloudinaryHelpers");

// @desc    Get all active team volunteers
// @route   GET /api/volunteers
// @access  Public
const getVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await Volunteer.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
  res.json({ success: true, count: volunteers.length, data: volunteers });
});

// @desc    Get all team volunteers (admin)
// @route   GET /api/volunteers/admin
// @access  Private
const getAllVolunteersAdmin = asyncHandler(async (req, res) => {
  const volunteers = await Volunteer.find().sort({ displayOrder: 1, createdAt: -1 });
  res.json({ success: true, count: volunteers.length, data: volunteers });
});

// @desc    Create team volunteer
// @route   POST /api/volunteers
// @access  Private
const createVolunteer = asyncHandler(async (req, res) => {
  const { name, role, instagram, displayOrder } = req.body;

  if (!name || !role) {
    res.status(400);
    throw new Error("Name and role are required");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("Volunteer image is required");
  }

  const volunteer = await Volunteer.create({
    name,
    role,
    instagram: instagram || "#",
    displayOrder: displayOrder || 0,
    image: { url: req.file.path, publicId: req.file.filename },
  });

  res.status(201).json({ success: true, data: volunteer });
});

// @desc    Update team volunteer
// @route   PUT /api/volunteers/:id
// @access  Private
const updateVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) {
    res.status(404);
    throw new Error("Volunteer not found");
  }

  const fields = ["name", "role", "instagram", "isActive", "displayOrder"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) volunteer[f] = req.body[f];
  });

  if (req.file) {
    await deleteCloudinaryAsset(volunteer.image?.publicId, "image");
    volunteer.image = { url: req.file.path, publicId: req.file.filename };
  }

  const updated = await volunteer.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete team volunteer
// @route   DELETE /api/volunteers/:id
// @access  Private
const deleteVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) {
    res.status(404);
    throw new Error("Volunteer not found");
  }

  await deleteCloudinaryAsset(volunteer.image?.publicId, "image");
  await volunteer.deleteOne();

  res.json({ success: true, message: "Volunteer deleted" });
});

module.exports = {
  getVolunteers,
  getAllVolunteersAdmin,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};
