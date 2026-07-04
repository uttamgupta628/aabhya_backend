const asyncHandler = require("express-async-handler");
const Testimonial = require("../models/Testimonial");
const { deleteCloudinaryAsset } = require("../utils/cloudinaryHelpers");

// @desc    Get all active testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: testimonials.length, data: testimonials });
});

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials/admin
// @access  Private
const getAllTestimonialsAdmin = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json({ success: true, count: testimonials.length, data: testimonials });
});

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private
const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, quote, rating } = req.body;

  if (!name || !role || !quote) {
    res.status(400);
    throw new Error("Name, role and quote are required");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("Avatar image is required");
  }

  const testimonial = await Testimonial.create({
    name,
    role,
    quote,
    rating: rating || 5,
    avatar: { url: req.file.path, publicId: req.file.filename },
  });

  res.status(201).json({ success: true, data: testimonial });
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  const fields = ["name", "role", "quote", "rating", "isActive"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) testimonial[f] = req.body[f];
  });

  if (req.file) {
    await deleteCloudinaryAsset(testimonial.avatar?.publicId, "image");
    testimonial.avatar = { url: req.file.path, publicId: req.file.filename };
  }

  const updated = await testimonial.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  await deleteCloudinaryAsset(testimonial.avatar?.publicId, "image");
  await testimonial.deleteOne();

  res.json({ success: true, message: "Testimonial deleted" });
});

module.exports = {
  getTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
