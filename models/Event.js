const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true }, // e.g. "Every Sunday" or an actual date string
    time: { type: String, required: true, trim: true }, // e.g. "11:00 am - 05:00 pm"
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
