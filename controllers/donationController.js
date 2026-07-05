const asyncHandler = require("express-async-handler");
const Donation = require("../models/Donation");
const Cause = require("../models/Cause");
const stripe = require("../config/stripe");
const { sendDonationLinkEmail, notifyAdminNewDonation } = require("../utils/emailService");

const DONATION_TYPE_LABELS = {
  love_offering: "Love Offering",
  sponsorship: "Sponsorship",
  one_time: "One Time Donation",
};

// @desc    Submit a donation request (DonationForm.tsx "Get Donate Link")
// @route   POST /api/donations
// @access  Public
const createDonation = asyncHandler(async (req, res) => {
  const { amount, paymentMethod, donationType, firstName, lastName, email, causeTitle } = req.body;

  if (!amount || !firstName || !lastName || !email) {
    res.status(400);
    throw new Error("Amount, first name, last name and email are required");
  }
  if (Number(amount) <= 0) {
    res.status(400);
    throw new Error("Amount must be greater than 0");
  }

  let causeRef = null;
  if (causeTitle) {
    const matchedCause = await Cause.findOne({ title: causeTitle });
    if (matchedCause) causeRef = matchedCause._id;
  }

  const donation = await Donation.create({
    amount,
    paymentMethod: paymentMethod === "upi" ? "upi" : "card",
    donationType,
    firstName,
    lastName,
    email,
    cause: causeRef,
    causeTitle: causeTitle || null,
  });

  // UPI donations are settled directly between the donor's UPI app and the
  // org's VPA — there's no gateway session to create. The donation stays
  // "pending" until an admin verifies the transfer and marks it completed.
  if (donation.paymentMethod === "upi") {
    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      notifyAdminNewDonation({
        adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL,
        firstName,
        lastName,
        amount,
        email,
        causeTitle,
      });
    }
    res.status(201).json({
      success: true,
      message: "Donation logged. Complete the UPI payment using the QR code shown.",
      data: donation,
      paymentLink: null,
    });
    return;
  }

  // Create a Stripe Checkout Session for this donation. Amount is in INR
  // (matches the ₹ symbol in DonationForm.tsx) — Stripe wants the smallest
  // currency unit, so paise.
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: causeTitle
                ? `Donation — ${causeTitle}`
                : `${DONATION_TYPE_LABELS[donationType] || "Donation"} — Aabhya Foundation`,
            },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL?.split(",")[0]?.trim()}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL?.split(",")[0]?.trim()}/Donation`,
      metadata: { donationId: donation._id.toString() },
    });

    donation.paymentLink = session.url;
    donation.status = "link_sent";
    await donation.save();
  } catch (err) {
    // Donation record still exists even if Stripe fails — admin can retry
    // generating a link manually via PUT /api/donations/:id
    console.error("Stripe checkout session creation failed:", err.message);
  }

  // Fire-and-forget emails — never block the response on these
  if (donation.paymentLink) {
    sendDonationLinkEmail({
      to: email,
      firstName,
      amount,
      paymentLink: donation.paymentLink,
      causeTitle,
    });
  }
  if (process.env.ADMIN_NOTIFICATION_EMAIL) {
    notifyAdminNewDonation({
      adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL,
      firstName,
      lastName,
      amount,
      email,
      causeTitle,
    });
  }

  res.status(201).json({
    success: true,
    message: donation.paymentLink
      ? "Donation request received. Redirecting to payment..."
      : "Donation request received. We'll email you a payment link shortly.",
    data: donation,
    paymentLink: donation.paymentLink,
  });
});

// @desc    Stripe webhook — marks a donation completed once payment succeeds
// @route   POST /api/webhooks/stripe
// @access  Public (verified via Stripe signature)
const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const donationId = session.metadata?.donationId;
    if (donationId) {
      await Donation.findByIdAndUpdate(donationId, { status: "completed" });
    }
  }

  res.json({ received: true });
});

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private
const getDonations = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const donations = await Donation.find(filter)
    .populate("cause", "title")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: donations.length, data: donations });
});

// @desc    Update donation status / payment link
// @route   PUT /api/donations/:id
// @access  Private
const updateDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }

  const fields = ["status", "paymentLink"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) donation[f] = req.body[f];
  });

  const updated = await donation.save();
  res.json({ success: true, data: updated });
});

module.exports = { createDonation, getDonations, updateDonation, handleStripeWebhook };