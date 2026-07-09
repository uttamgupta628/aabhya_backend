const express = require("express");
const router = express.Router();
const {
  getGalleryPhotos,
  getAllGalleryPhotosAdmin,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
} = require("../controllers/Galleryphotocontroller");
const { protect } = require("../middleware/auth");
const { uploadGalleryPhoto } = require("../middleware/upload");

router.get("/", getGalleryPhotos);
router.get("/admin", protect, getAllGalleryPhotosAdmin);
router.post("/", protect, uploadGalleryPhoto.single("photo"), createGalleryPhoto);
router.put("/:id", protect, uploadGalleryPhoto.single("photo"), updateGalleryPhoto);
router.delete("/:id", protect, deleteGalleryPhoto);

module.exports = router;