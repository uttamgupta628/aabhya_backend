const mongoose = require("mongoose");

// Represents the TEAM MEMBERS displayed in VolunteersSection.tsx
// (distinct from VolunteerApplication.js, which stores public sign-up submissions)
const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true }, // e.g. "Coordinator"
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    instagram: { type: String, default: "#" },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
