const express = require("express");
const router = express.Router();
const { createDonation, getDonations, updateDonation } = require("../controllers/donationController");
const { protect } = require("../middleware/auth");
const publicFormLimiter = require("../middleware/publicFormLimiter");

router.post("/", publicFormLimiter, createDonation);
router.get("/", protect, getDonations);
router.put("/:id", protect, updateDonation);

module.exports = router;