const { cloudinary } = require("../config/cloudinary");

/**
 * Deletes an asset from Cloudinary given its publicId.
 * Safe to call even if publicId is null/undefined.
 */
const deleteCloudinaryAsset = async (publicId, resourceType = "image") => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, err.message);
  }
};

module.exports = { deleteCloudinaryAsset };
