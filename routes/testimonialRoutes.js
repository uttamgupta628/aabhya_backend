const express = require("express");
const router = express.Router();
const {
  getTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const { protect } = require("../middleware/auth");
const { uploadTestimonialAvatar } = require("../middleware/upload");

router.get("/", getTestimonials);
router.get("/admin", protect, getAllTestimonialsAdmin);
router.post("/", protect, uploadTestimonialAvatar.single("avatar"), createTestimonial);
router.put("/:id", protect, uploadTestimonialAvatar.single("avatar"), updateTestimonial);
router.delete("/:id", protect, deleteTestimonial);

module.exports = router;
