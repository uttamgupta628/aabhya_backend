const rateLimit = require("express-rate-limit");

// Applies only to the public POST endpoints (donations, contact, newsletter,
// volunteer applications) — never to admin GET/PUT/DELETE routes, which are
// already behind JWT auth and legitimately called often (e.g. dashboard loads).
const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: "Too many requests, please try again later." },
});

module.exports = publicFormLimiter;