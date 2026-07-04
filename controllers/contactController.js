const asyncHandler = require("express-async-handler");
const ContactMessage = require("../models/ContactMessage");
const { sendContactAckEmail, notifyAdminNewContact } = require("../utils/emailService");

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email and message are required");
  }

  const contactMessage = await ContactMessage.create({ name, email, phone, subject, message });

  sendContactAckEmail({ to: email, name });
  if (process.env.ADMIN_NOTIFICATION_EMAIL) {
    notifyAdminNewContact({
      adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL,
      name,
      email,
      phone,
      subject,
      message,
    });
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully. We'll get back to you soon!",
    data: contactMessage,
  });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private
const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, data: messages });
});

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
// @access  Private
const markMessageRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  message.isRead = true;
  await message.save();
  res.json({ success: true, data: message });
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private
const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  await message.deleteOne();
  res.json({ success: true, message: "Message deleted" });
});

module.exports = {
  submitContactMessage,
  getContactMessages,
  markMessageRead,
  deleteContactMessage,
};
