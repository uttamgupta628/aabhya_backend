const express = require("express");
const router = express.Router();
const {
  getVolunteers,
  getAllVolunteersAdmin,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
} = require("../controllers/volunteerController");
const { protect } = require("../middleware/auth");
const { uploadVolunteerImage } = require("../middleware/upload");

router.get("/", getVolunteers);
router.get("/admin", protect, getAllVolunteersAdmin);
router.post("/", protect, uploadVolunteerImage.single("image"), createVolunteer);
router.put("/:id", protect, uploadVolunteerImage.single("image"), updateVolunteer);
router.delete("/:id", protect, deleteVolunteer);

module.exports = router;
