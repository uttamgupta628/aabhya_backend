const mongoose = require("mongoose");

const causeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      trim: true,
      default: "GENERAL",
      uppercase: true,
    },
    // Either/both may be set — CharityFund.tsx cards use video, PopularCauses.tsx cards use image
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    video: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    goalAmount: { type: Number, required: true, min: 1 },
    raisedAmount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }, // for the slider on CharityFund
  },
  { timestamps: true }
);

causeSchema.virtual("progressPercent").get(function () {
  if (!this.goalAmount) return 0;
  return Math.min(100, Math.round((this.raisedAmount / this.goalAmount) * 100));
});

causeSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Cause", causeSchema);
