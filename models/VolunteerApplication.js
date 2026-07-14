const mongoose = require("mongoose");
const validator = require("validator");

const volunteerApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,   
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: { type: String, required: true, trim: true },
    dob: { type: String, trim: true }, // stored as submitted (e.g. "2013-06-28")
    occupation: { type: String, trim: true },
    address: { type: String, trim: true },
    county: { type: String, trim: true }, // county / state
    message: { type: String, trim: true },
    // Optional photo uploaded by the applicant with the enrollment form
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "approved", "rejected"],
      default: "pending",
    },
    // Set once this application is approved and a matching entry is created
    // in the Volunteer collection (the team grid shown on VolunteerPage.tsx)
    linkedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: "Volunteer", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VolunteerApplication", volunteerApplicationSchema);