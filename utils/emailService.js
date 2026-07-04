const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

/**
 * Sends an email. Never throws — logs and swallows errors so a failed email
 * never breaks the API response for the person who just submitted a form.
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(`SMTP not configured — skipped email to ${to} ("${subject}")`);
    return;
  }

  try {
    await getTransporter().sendMail({
      from: `"Aabhya Foundation" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
  }
};

const wrapper = (title, bodyHtml) => `
  <div style="font-family:'Georgia',serif;max-width:560px;margin:0 auto;color:#0d2b2b;">
    <div style="background:#0d2b2b;padding:20px 28px;border-radius:12px 12px 0 0;">
      <h2 style="color:#fff;margin:0;font-size:18px;letter-spacing:0.05em;">Aabhya Foundation</h2>
    </div>
    <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:28px;">
      <h3 style="margin-top:0;color:#0d2b2b;">${title}</h3>
      ${bodyHtml}
      <p style="margin-top:28px;font-size:12px;color:#9ca3af;">
        Shree Appartment, Sadanand Chakraborty Lane, Near Shyam Mandir, 713347, West Bengal, India
      </p>
    </div>
  </div>
`;

// ── Donation ──────────────────────────────────────────────
const sendDonationLinkEmail = async ({ to, firstName, amount, paymentLink, causeTitle }) =>
  sendEmail({
    to,
    subject: "Complete your donation to Aabhya Foundation",
    html: wrapper(
      `Thank you, ${firstName}!`,
      `<p style="color:#4b5563;line-height:1.6;">
        Your donation request of <strong>₹${amount}</strong>${
        causeTitle ? ` for <strong>${causeTitle}</strong>` : ""
      } has been received.
      </p>
      <a href="${paymentLink}" style="display:inline-block;margin-top:12px;background:#e8490f;
        color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;
        letter-spacing:0.08em;text-transform:uppercase;font-size:13px;">
        Complete Payment
      </a>`
    ),
  });

// Sent once Stripe confirms payment succeeded (checkout.session.completed webhook)
const sendDonationSuccessEmail = async ({ to, firstName, amount, causeTitle }) =>
  sendEmail({
    to,
    subject: "Your donation to Aabhya Foundation is confirmed 🎉",
    html: wrapper(
      `Thank you, ${firstName}!`,
      `<p style="color:#4b5563;line-height:1.6;">
        We've successfully received your payment of <strong>₹${amount}</strong>${
        causeTitle ? ` towards <strong>${causeTitle}</strong>` : ""
      }.
      </p>
      <p style="color:#4b5563;line-height:1.6;">
        Your generosity means a lot to the people we serve. We'll keep you updated on the impact
        your donation makes.
      </p>`
    ),
  });

const notifyAdminNewDonation = async ({ adminEmail, firstName, lastName, amount, email, causeTitle }) =>
  sendEmail({
    to: adminEmail,
    subject: `New donation request — ₹${amount}`,
    html: wrapper(
      "New Donation Request",
      `<p style="color:#4b5563;line-height:1.8;">
        <strong>${firstName} ${lastName}</strong> (${email}) requested to donate <strong>₹${amount}</strong>
        ${causeTitle ? `towards <strong>${causeTitle}</strong>` : ""}.
      </p>`
    ),
  });

// ── Contact ───────────────────────────────────────────────
const sendContactAckEmail = async ({ to, name }) =>
  sendEmail({
    to,
    subject: "We received your message",
    html: wrapper(
      `Hi ${name},`,
      `<p style="color:#4b5563;line-height:1.6;">
        Thanks for reaching out to Aabhya Foundation. Our team will get back to you shortly.
      </p>`
    ),
  });

const notifyAdminNewContact = async ({ adminEmail, name, email, phone, subject, message }) =>
  sendEmail({
    to: adminEmail,
    subject: `New contact message: ${subject || "No subject"}`,
    html: wrapper(
      "New Contact Message",
      `<p style="color:#4b5563;line-height:1.8;">
        <strong>${name}</strong> (${email}${phone ? `, ${phone}` : ""})<br/>
        ${message}
      </p>`
    ),
  });

// ── Volunteer application ───────────────────────────────────
const sendVolunteerAckEmail = async ({ to, fullName }) =>
  sendEmail({
    to,
    subject: "Thanks for applying to volunteer!",
    html: wrapper(
      `Hi ${fullName},`,
      `<p style="color:#4b5563;line-height:1.6;">
        We've received your volunteer application. Our team will reach out soon to discuss next steps.
      </p>`
    ),
  });

const notifyAdminNewVolunteerApplication = async ({ adminEmail, fullName, email, phone, areaOfInterest }) =>
  sendEmail({
    to: adminEmail,
    subject: `New volunteer application: ${fullName}`,
    html: wrapper(
      "New Volunteer Application",
      `<p style="color:#4b5563;line-height:1.8;">
        <strong>${fullName}</strong> (${email}, ${phone})<br/>
        ${areaOfInterest ? `Interested in: ${areaOfInterest}` : ""}
      </p>`
    ),
  });

module.exports = {
  sendDonationLinkEmail,
  sendDonationSuccessEmail,
  notifyAdminNewDonation,
  sendContactAckEmail,
  notifyAdminNewContact,
  sendVolunteerAckEmail,
  notifyAdminNewVolunteerApplication,
};