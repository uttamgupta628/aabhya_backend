const asyncHandler = require("express-async-handler");
const Cause = require("../models/Cause");
const { deleteCloudinaryAsset } = require("../utils/cloudinaryHelpers");

// @desc    Get all active causes (supports ?featured=true for the CharityFund slider)
// @route   GET /api/causes
// @access  Public
const getCauses = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.featured === "true") filter.isFeatured = true;

  const causes = await Cause.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: causes.length, data: causes });
});

// @desc    Get all causes including inactive (admin)
// @route   GET /api/causes/admin
// @access  Private
const getAllCausesAdmin = asyncHandler(async (req, res) => {
  const causes = await Cause.find().sort({ createdAt: -1 });
  res.json({ success: true, count: causes.length, data: causes });
});

// @desc    Get single cause
// @route   GET /api/causes/:id
// @access  Public
const getCauseById = asyncHandler(async (req, res) => {
  const cause = await Cause.findById(req.params.id);
  if (!cause) {
    res.status(404);
    throw new Error("Cause not found");
  }
  res.json({ success: true, data: cause });
});

// @desc    Create a cause
// @route   POST /api/causes
// @access  Private
const createCause = asyncHandler(async (req, res) => {
  const { title, description, category, goalAmount, raisedAmount, isFeatured } = req.body;

  if (!title || !description || !goalAmount) {
    res.status(400);
    throw new Error("Title, description and goalAmount are required");
  }

  const cause = new Cause({
    title,
    description,
    category,
    goalAmount,
    raisedAmount: raisedAmount || 0,
    isFeatured: isFeatured === "true" || isFeatured === true,
  });

  if (req.files?.image?.[0]) {
    cause.image = { url: req.files.image[0].path, publicId: req.files.image[0].filename };
  }
  if (req.files?.video?.[0]) {
    cause.video = { url: req.files.video[0].path, publicId: req.files.video[0].filename };
  }

  const created = await cause.save();
  res.status(201).json({ success: true, data: created });
});

// @desc    Update a cause
// @route   PUT /api/causes/:id
// @access  Private
const updateCause = asyncHandler(async (req, res) => {
  const cause = await Cause.findById(req.params.id);
  if (!cause) {
    res.status(404);
    throw new Error("Cause not found");
  }

  const fields = ["title", "description", "category", "goalAmount", "raisedAmount", "isActive", "isFeatured"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) cause[f] = req.body[f];
  });

  if (req.files?.image?.[0]) {
    await deleteCloudinaryAsset(cause.image?.publicId, "image");
    cause.image = { url: req.files.image[0].path, publicId: req.files.image[0].filename };
  }
  if (req.files?.video?.[0]) {
    await deleteCloudinaryAsset(cause.video?.publicId, "video");
    cause.video = { url: req.files.video[0].path, publicId: req.files.video[0].filename };
  }

  const updated = await cause.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a cause
// @route   DELETE /api/causes/:id
// @access  Private
const deleteCause = asyncHandler(async (req, res) => {
  const cause = await Cause.findById(req.params.id);
  if (!cause) {
    res.status(404);
    throw new Error("Cause not found");
  }

  await deleteCloudinaryAsset(cause.image?.publicId, "image");
  await deleteCloudinaryAsset(cause.video?.publicId, "video");
  await cause.deleteOne();

  res.json({ success: true, message: "Cause deleted" });
});

module.exports = {
  getCauses,
  getAllCausesAdmin,
  getCauseById,
  createCause,
  updateCause,
  deleteCause,
};
