const asyncHandler = require("express-async-handler");
const VolunteerApplication = require("../models/VolunteerApplication");
const Volunteer = require("../models/Volunteer");
const { deleteCloudinaryAsset } = require("../utils/cloudinaryHelpers");
const {
  sendVolunteerAckEmail,
  notifyAdminNewVolunteerApplication,
} = require("../utils/emailService");

// @desc    Submit a volunteer application
// @route   POST /api/volunteer-applications
// @access  Public
const submitVolunteerApplication = asyncHandler(async (req, res) => {
  const { name, email, phone, dob, occupation, address, county, message } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Full name, email and phone are required");
  }

  // Prevent duplicate applications from the same email
  const existing = await VolunteerApplication.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    res.status(409);
    throw new Error("An application with this email has already been submitted.");
  }

  const application = await VolunteerApplication.create({
    fullName: name,
    email,
    phone,
    dob,
    occupation,
    address,
    county,
    message,
    image: req.file ? { url: req.file.path, publicId: req.file.filename } : undefined,
  });

  sendVolunteerAckEmail({ to: email, fullName: name });

  if (process.env.ADMIN_NOTIFICATION_EMAIL) {
    notifyAdminNewVolunteerApplication({
      adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL,
      fullName: name,
      email,
      phone,
      areaOfInterest: occupation,
    });
  }

  res.status(201).json({
    success: true,
    message: "Thanks for applying! Our team will reach out soon.",
    data: application,
  });
});

// @desc    Get all volunteer applications
// @route   GET /api/volunteer-applications
// @access  Private
const getVolunteerApplications = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const applications = await VolunteerApplication.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: applications.length, data: applications });
});

// @desc    Update application status
// @route   PUT /api/volunteer-applications/:id
// @access  Private
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await VolunteerApplication.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }
  if (req.body.status) application.status = req.body.status;
  const updated = await application.save();

  // Keep the public "Volunteer" team grid (VolunteerPage.tsx / VolunteerSection.tsx)
  // in sync with approval status.
  if (updated.status === "approved") {
    if (updated.linkedVolunteer) {
      // Already promoted before — just make sure it's visible again and refreshed.
      await Volunteer.findByIdAndUpdate(updated.linkedVolunteer, {
        name: updated.fullName,
        role: updated.occupation || "Volunteer",
        isActive: true,
        ...(updated.image?.url ? { image: updated.image } : {}),
      });
    } else {
      const volunteer = await Volunteer.create({
        name: updated.fullName,
        role: updated.occupation || "Volunteer",
        instagram: "#",
        isActive: true,
        image: updated.image?.url ? updated.image : undefined,
      });
      updated.linkedVolunteer = volunteer._id;
      await updated.save();
    }
  } else if (updated.linkedVolunteer) {
    // Status moved away from "approved" — hide from the public grid without
    // deleting it, in case it gets re-approved later.
    await Volunteer.findByIdAndUpdate(updated.linkedVolunteer, { isActive: false });
  }

  res.json({ success: true, data: updated });
});

// @desc    Delete application
// @route   DELETE /api/volunteer-applications/:id
// @access  Private
const deleteVolunteerApplication = asyncHandler(async (req, res) => {
  const application = await VolunteerApplication.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (application.linkedVolunteer) {
    const volunteer = await Volunteer.findById(application.linkedVolunteer);
    if (volunteer) {
      await deleteCloudinaryAsset(volunteer.image?.publicId, "image");
      await volunteer.deleteOne();
    }
  }

  await application.deleteOne();
  res.json({ success: true, message: "Application deleted" });
});

module.exports = {
  submitVolunteerApplication,
  getVolunteerApplications,
  updateApplicationStatus,
  deleteVolunteerApplication,
};