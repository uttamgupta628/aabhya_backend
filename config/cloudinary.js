const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Reusable storage factory.
 * folder   -> cloudinary folder to organize uploads (e.g. "causes", "events")
 * resource -> "image" | "video" | "auto" (auto lets Cloudinary detect, needed for CharityFund videos)
 */
const makeStorage = (folder, resource = "image") =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `aabhya-foundation/${folder}`,
      resource_type: resource,
      allowed_formats:
        resource === "video"
          ? ["mp4", "mov", "webm"]
          : ["jpg", "jpeg", "png", "webp"],
    },
  });

module.exports = { cloudinary, makeStorage };
