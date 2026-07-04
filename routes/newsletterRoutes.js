const express = require("express");
const router = express.Router();
const { subscribeNewsletter, getSubscribers, deleteSubscriber } = require("../controllers/newsletterController");
const { protect } = require("../middleware/auth");
const publicFormLimiter = require("../middleware/publicFormLimiter");

router.post("/", publicFormLimiter, subscribeNewsletter);
router.get("/", protect, getSubscribers);
router.delete("/:id", protect, deleteSubscriber);

module.exports = router;