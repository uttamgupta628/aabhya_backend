const multer = require("multer");
const { makeStorage } = require("../config/cloudinary");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 60 * 1024 * 1024; // 60MB

// Causes can take an image AND/OR a video in the same request (CharityFund.tsx
// uses video, PopularCauses.tsx uses image). resource_type "auto" lets Cloudinary
// detect the type per file so one storage engine can serve both fields.
const uploadCauseMedia = multer({
  storage: makeStorage("causes", "auto"),
  limits: { fileSize: MAX_VIDEO_SIZE },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

const uploadEventImage = multer({
  storage: makeStorage("events", "image"),
  limits: { fileSize: MAX_IMAGE_SIZE },
});

const uploadTestimonialAvatar = multer({
  storage: makeStorage("testimonials", "image"),
  limits: { fileSize: MAX_IMAGE_SIZE },
});

const uploadVolunteerImage = multer({
  storage: makeStorage("volunteers", "image"),
  limits: { fileSize: MAX_IMAGE_SIZE },
});

const uploadVolunteerApplicationImage = multer({
  storage: makeStorage("volunteer-applications", "image"),
  limits: { fileSize: MAX_IMAGE_SIZE },
});

// Gallery — Video Reels (GalleryPage.tsx "Videos" tab). Bump the limit above
// 60MB here if your Sankalp Sunday clips regularly run larger than that.
const uploadGalleryVideo = multer({
  storage: makeStorage("gallery-videos", "video"),
  limits: { fileSize: MAX_VIDEO_SIZE },
});

// Gallery — Photo Moments (GalleryPage.tsx "Photos" tab)
const uploadGalleryPhoto = multer({
  storage: makeStorage("gallery-photos", "image"),
  limits: { fileSize: MAX_IMAGE_SIZE },
});

module.exports = {
  uploadCauseMedia,
  uploadEventImage,
  uploadTestimonialAvatar,
  uploadVolunteerImage,
  uploadVolunteerApplicationImage,
  uploadGalleryVideo,
  uploadGalleryPhoto,
};