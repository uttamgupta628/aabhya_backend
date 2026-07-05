const express = require("express");
const router = express.Router();
const {
  createDonation,
  getDonations,
  updateDonation,
  submitUtrReference,
} = require("../controllers/donationController");
const { protect } = require("../middleware/auth");
const publicFormLimiter = require("../middleware/publicFormLimiter");

router.post("/", publicFormLimiter, createDonation);
router.get("/", protect, getDonations);
router.put("/:id", protect, updateDonation);
router.put("/:id/utr", publicFormLimiter, submitUtrReference);

module.exports = router;