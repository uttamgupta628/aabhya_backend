const mongoose = require("mongoose");

// Represents the TEAM MEMBERS displayed in VolunteersSection.tsx
// (distinct from VolunteerApplication.js, which stores public sign-up submissions)
const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true }, // e.g. "Coordinator"
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    instagram: { type: String, default: "#" },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);