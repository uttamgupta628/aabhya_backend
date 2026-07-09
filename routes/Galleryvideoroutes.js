const express = require("express");
const router = express.Router();
const {
  getGalleryVideos,
  getAllGalleryVideosAdmin,
  createGalleryVideo,
  updateGalleryVideo,
  deleteGalleryVideo,
} = require("../controllers/Galleryvideocontroller");
const { protect } = require("../middleware/auth");
const { uploadGalleryVideo } = require("../middleware/upload");

router.get("/", getGalleryVideos);
router.get("/admin", protect, getAllGalleryVideosAdmin);
router.post("/", protect, uploadGalleryVideo.single("video"), createGalleryVideo);
router.put("/:id", protect, uploadGalleryVideo.single("video"), updateGalleryVideo);
router.delete("/:id", protect, deleteGalleryVideo);

module.exports = router;