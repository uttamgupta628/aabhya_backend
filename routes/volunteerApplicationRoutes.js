const express = require("express");
const router = express.Router();
const {
  submitVolunteerApplication,
  getVolunteerApplications,
  updateApplicationStatus,
  deleteVolunteerApplication,
} = require("../controllers/volunteerApplicationController");
const { protect } = require("../middleware/auth");
const publicFormLimiter = require("../middleware/publicFormLimiter");
const { uploadVolunteerApplicationImage } = require("../middleware/upload");

router.post("/", publicFormLimiter, uploadVolunteerApplicationImage.single("image"), submitVolunteerApplication);
router.get("/", protect, getVolunteerApplications);
router.put("/:id", protect, updateApplicationStatus);
router.delete("/:id", protect, deleteVolunteerApplication);

module.exports = router;