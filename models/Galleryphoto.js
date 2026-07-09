const mongoose = require("mongoose");

const galleryPhotoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // Matches the frontend `PhotoCategory` type (excluding "All", which is a client-only filter value)
    category: {
      type: String,
      required: true,
      enum: ["Orphans", "Food Distribution", "Events"],
    },
    photo: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    isNew: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryPhoto", galleryPhotoSchema);