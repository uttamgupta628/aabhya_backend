const express = require("express");
const router = express.Router();
const { handleStripeWebhook } = require("../controllers/donationController");

// NOTE: this route must be mounted in server.js BEFORE express.json() runs
// on it, using express.raw({ type: "application/json" }) — Stripe signature
// verification needs the untouched raw request body.
router.post("/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router;
