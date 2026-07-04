const express = require("express");
const router = express.Router();
const {
  getCauses,
  getAllCausesAdmin,
  getCauseById,
  createCause,
  updateCause,
  deleteCause,
} = require("../controllers/causeController");
const { protect } = require("../middleware/auth");
const { uploadCauseMedia } = require("../middleware/upload");

router.get("/", getCauses);
router.get("/admin", protect, getAllCausesAdmin);
router.get("/:id", getCauseById);
router.post("/", protect, uploadCauseMedia, createCause);
router.put("/:id", protect, uploadCauseMedia, updateCause);
router.delete("/:id", protect, deleteCause);

module.exports = router;
