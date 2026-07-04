const asyncHandler = require("express-async-handler");
const Newsletter = require("../models/Newsletter");

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const exists = await Newsletter.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(200).json({ success: true, message: "You're already subscribed!" });
    return;
  }

  await Newsletter.create({ email });
  res.status(201).json({ success: true, message: "Subscribed successfully!" });
});

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find().sort({ createdAt: -1 });
  res.json({ success: true, count: subscribers.length, data: subscribers });
});

// @desc    Remove a subscriber
// @route   DELETE /api/newsletter/:id
// @access  Private
const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await Newsletter.findById(req.params.id);
  if (!subscriber) {
    res.status(404);
    throw new Error("Subscriber not found");
  }
  await subscriber.deleteOne();
  res.json({ success: true, message: "Subscriber removed" });
});

module.exports = { subscribeNewsletter, getSubscribers, deleteSubscriber };
