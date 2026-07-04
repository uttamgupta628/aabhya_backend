const express = require("express");
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  markMessageRead,
  deleteContactMessage,
} = require("../controllers/contactController");
const { protect } = require("../middleware/auth");
const publicFormLimiter = require("../middleware/publicFormLimiter");

router.post("/", publicFormLimiter, submitContactMessage);
router.get("/", protect, getContactMessages);
router.put("/:id/read", protect, markMessageRead);
router.delete("/:id", protect, deleteContactMessage);

module.exports = router;