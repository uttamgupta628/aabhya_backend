const mongoose = require("mongoose");
const validator = require("validator");

const donationSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 1 },
    donationType: {
      type: String,
      enum: ["love_offering", "sponsorship", "one_time"],
      required: true,
      default: "love_offering",
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    // Optional link to a specific cause — CharityFund.tsx passes cause.title via
    // navigate("/Donation", { state: { cause: cause.title } })
    cause: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cause",
      default: null,
    },
    causeTitle: { type: String, default: null }, // fallback if no ObjectId match found
    status: {
      type: String,
      enum: ["pending", "link_sent", "completed", "failed"],
      default: "pending",
    },
    // Populated once a payment link / gateway session is generated
    paymentLink: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
