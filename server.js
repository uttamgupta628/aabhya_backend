require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const causeRoutes = require("./routes/causeRoutes");
const eventRoutes = require("./routes/eventRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const volunteerApplicationRoutes = require("./routes/volunteerApplicationRoutes");
const donationRoutes = require("./routes/donationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const configRoutes = require("./routes/configRoutes");

connectDB();

const app = express();

// Core middleware
app.use(helmet());

// CLIENT_URL supports a comma-separated list so both the public site and the
// admin panel (different ports/origins) can talk to this API.
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no origin header) and any configured origin
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Stripe webhook needs the RAW body for signature verification, so it must
// be mounted before express.json() parses the body on every other route.
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => res.json({ success: true, message: "API is running" }));

// Mounted routes
app.use("/api/auth", authRoutes);
app.use("/api/causes", causeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/volunteer-applications", volunteerApplicationRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/config", configRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});