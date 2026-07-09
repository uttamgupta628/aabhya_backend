const mongoose = require("mongoose");

const galleryVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // Matches the frontend `Category` type (excluding "All", which is a client-only filter value)
    category: {
      type: String,
      required: true,
      enum: ["Food Distribution", "Events"],
    },
    video: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    isNew: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryVideo", galleryVideoSchema);