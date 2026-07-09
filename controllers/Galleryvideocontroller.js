const asyncHandler = require("express-async-handler");
const GalleryVideo = require("../models/Galleryvideo");
const { deleteCloudinaryAsset } = require("../utils/cloudinaryHelpers");

// @desc    Get all active gallery videos
// @route   GET /api/gallery/videos
// @access  Public
const getGalleryVideos = asyncHandler(async (req, res) => {
  const videos = await GalleryVideo.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: videos.length, data: videos });
});

// @desc    Get all gallery videos (admin)
// @route   GET /api/gallery/videos/admin
// @access  Private
const getAllGalleryVideosAdmin = asyncHandler(async (req, res) => {
  const videos = await GalleryVideo.find().sort({ createdAt: -1 });
  res.json({ success: true, count: videos.length, data: videos });
});

// @desc    Create gallery video
// @route   POST /api/gallery/videos
// @access  Private
const createGalleryVideo = asyncHandler(async (req, res) => {
  const { title, category, isNew, isActive } = req.body;
  if (!title || !category) {
    res.status(400);
    throw new Error("Title and category are required");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("Video file is required");
  }
  const video = await GalleryVideo.create({
    title,
    category,
    isNew: isNew === "true" || isNew === true || false,
    ...(isActive !== undefined && { isActive: isActive === "true" || isActive === true }),
    video: { url: req.file.path, publicId: req.file.filename },
  });
  res.status(201).json({ success: true, data: video });
});

// @desc    Update gallery video
// @route   PUT /api/gallery/videos/:id
// @access  Private
const updateGalleryVideo = asyncHandler(async (req, res) => {
  const video = await GalleryVideo.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error("Gallery video not found");
  }
  const fields = ["title", "category", "isNew", "isActive"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) {
      video[f] = f === "isNew" || f === "isActive" ? req.body[f] === "true" || req.body[f] === true : req.body[f];
    }
  });
  if (req.file) {
    await deleteCloudinaryAsset(video.video?.publicId, "video");
    video.video = { url: req.file.path, publicId: req.file.filename };
  }
  const updated = await video.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete gallery video
// @route   DELETE /api/gallery/videos/:id
// @access  Private
const deleteGalleryVideo = asyncHandler(async (req, res) => {
  const video = await GalleryVideo.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error("Gallery video not found");
  }
  await deleteCloudinaryAsset(video.video?.publicId, "video");
  await video.deleteOne();
  res.json({ success: true, message: "Gallery video deleted" });
});

module.exports = {
  getGalleryVideos,
  getAllGalleryVideosAdmin,
  createGalleryVideo,
  updateGalleryVideo,
  deleteGalleryVideo,
};