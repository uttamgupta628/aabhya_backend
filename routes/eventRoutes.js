const express = require("express");
const router = express.Router();
const {
  getEvents,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");
const { uploadEventImage } = require("../middleware/upload");

router.get("/", getEvents);
router.get("/admin", protect, getAllEventsAdmin);
router.post("/", protect, uploadEventImage.single("image"), createEvent);
router.put("/:id", protect, uploadEventImage.single("image"), updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;
