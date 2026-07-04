const asyncHandler = require("express-async-handler");
const Event = require("../models/Event");
const { deleteCloudinaryAsset } = require("../utils/cloudinaryHelpers");

// @desc    Get all active events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: events.length, data: events });
});

// @desc    Get all events (admin)
// @route   GET /api/events/admin
// @access  Private
const getAllEventsAdmin = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json({ success: true, count: events.length, data: events });
});

// @desc    Create event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { title, date, time, location, description } = req.body;

  if (!title || !date || !time || !location || !description) {
    res.status(400);
    throw new Error("All event fields are required");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("Event image is required");
  }

  const event = await Event.create({
    title,
    date,
    time,
    location,
    description,
    image: { url: req.file.path, publicId: req.file.filename },
  });

  res.status(201).json({ success: true, data: event });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const fields = ["title", "date", "time", "location", "description", "isActive"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) event[f] = req.body[f];
  });

  if (req.file) {
    await deleteCloudinaryAsset(event.image?.publicId, "image");
    event.image = { url: req.file.path, publicId: req.file.filename };
  }

  const updated = await event.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  await deleteCloudinaryAsset(event.image?.publicId, "image");
  await event.deleteOne();

  res.json({ success: true, message: "Event deleted" });
});

module.exports = { getEvents, getAllEventsAdmin, createEvent, updateEvent, deleteEvent };
