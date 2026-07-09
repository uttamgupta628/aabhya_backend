const mongoose = require("mongoose");
const validator = require("validator");

const donationSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 1 },
    paymentMethod: {
      type: String,
      enum: ["card", "upi"],
      default: "card",
    },
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
    // ── Fields added to match DonationForm.tsx ──
    // "I Want to Donate for" dropdown on the form (general/food/clothes/education/medical).
    // Kept separate from `cause`/`causeTitle` above, which link to a specific Cause document.
    fundCategory: {
      type: String,
      enum: ["general", "food", "clothes", "education", "medical", null],
      default: null,
    },
    phone: { type: String, trim: true, default: null },
    aadharNumber: { type: String, trim: true, default: null },
    // "Do You Want 80G Tax Benefit" — stored as submitted ("yes"/"no")
    wantsTaxBenefit: { type: String, enum: ["yes", "no", null], default: null },
    // "Are You Citizen In India"
    isIndianCitizen: { type: String, enum: ["yes", "no", null], default: null },
    status: {
      type: String,
      enum: ["pending", "link_sent", "utr_submitted", "completed", "failed"],
      default: "pending",
    },
    // Populated once a payment link / gateway session is generated
    paymentLink: { type: String, default: null },
    // Donor-submitted UPI transaction reference (UTR/Ref No) — self-reported,
    // not verified automatically. Admin cross-checks against bank statement.
    utrReference: { type: String, default: null, trim: true },
    utrSubmittedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);