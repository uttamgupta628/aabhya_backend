const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password, not the account password
    },
  });

  return transporter;
};

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn(`EMAIL_USER/EMAIL_APP_PASSWORD not set — skipping email to ${to} ("${subject}")`);
    return { skipped: true };
  }

  try {
    const info = await getTransporter().sendMail({
      from: `"Aabhya Foundation" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (err) {
    // Email failures should never crash the request — just log and move on
    console.error(`Failed to send email to ${to}:`, err.message);
    return { error: err.message };
  }
};

module.exports = sendEmail;
