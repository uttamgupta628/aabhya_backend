const asyncHandler = require("express-async-handler");
const GalleryPhoto = require("../models/GalleryPhoto");
const { deleteCloudinaryAsset } = require("../utils/cloudinaryHelpers");

// @desc    Get all active gallery photos
// @route   GET /api/gallery/photos
// @access  Public
const getGalleryPhotos = asyncHandler(async (req, res) => {
  const photos = await GalleryPhoto.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: photos.length, data: photos });
});

// @desc    Get all gallery photos (admin)
// @route   GET /api/gallery/photos/admin
// @access  Private
const getAllGalleryPhotosAdmin = asyncHandler(async (req, res) => {
  const photos = await GalleryPhoto.find().sort({ createdAt: -1 });
  res.json({ success: true, count: photos.length, data: photos });
});

// @desc    Create gallery photo
// @route   POST /api/gallery/photos
// @access  Private
const createGalleryPhoto = asyncHandler(async (req, res) => {
  const { title, category, isNew, isActive } = req.body;
  if (!title || !category) {
    res.status(400);
    throw new Error("Title and category are required");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("Photo file is required");
  }
  const photo = await GalleryPhoto.create({
    title,
    category,
    isNew: isNew === "true" || isNew === true || false,
    ...(isActive !== undefined && { isActive: isActive === "true" || isActive === true }),
    photo: { url: req.file.path, publicId: req.file.filename },
  });
  res.status(201).json({ success: true, data: photo });
});

// @desc    Update gallery photo
// @route   PUT /api/gallery/photos/:id
// @access  Private
const updateGalleryPhoto = asyncHandler(async (req, res) => {
  const photo = await GalleryPhoto.findById(req.params.id);
  if (!photo) {
    res.status(404);
    throw new Error("Gallery photo not found");
  }
  const fields = ["title", "category", "isNew", "isActive"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) {
      photo[f] = f === "isNew" || f === "isActive" ? req.body[f] === "true" || req.body[f] === true : req.body[f];
    }
  });
  if (req.file) {
    await deleteCloudinaryAsset(photo.photo?.publicId, "image");
    photo.photo = { url: req.file.path, publicId: req.file.filename };
  }
  const updated = await photo.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete gallery photo
// @route   DELETE /api/gallery/photos/:id
// @access  Private
const deleteGalleryPhoto = asyncHandler(async (req, res) => {
  const photo = await GalleryPhoto.findById(req.params.id);
  if (!photo) {
    res.status(404);
    throw new Error("Gallery photo not found");
  }
  await deleteCloudinaryAsset(photo.photo?.publicId, "image");
  await photo.deleteOne();
  res.json({ success: true, message: "Gallery photo deleted" });
});

module.exports = {
  getGalleryPhotos,
  getAllGalleryPhotosAdmin,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
};