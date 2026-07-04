const wrapper = (bodyHtml) => `
  <div style="font-family: 'Georgia', serif; background:#f5f2eb; padding:32px;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden;">
      <div style="background:#0d2b2b; padding:20px 28px;">
        <span style="color:#ffffff; font-weight:800; font-size:16px; letter-spacing:0.05em;">AABHYA FOUNDATION</span>
      </div>
      <div style="padding:28px;">
        ${bodyHtml}
      </div>
      <div style="background:#f5f2eb; padding:16px 28px; text-align:center;">
        <span style="color:#9ca3af; font-size:11px;">© 2026–2027 AabhyaFoundation | All Rights Reserved</span>
      </div>
    </div>
  </div>
`;

const donationLinkEmail = ({ firstName, amount, paymentLink, causeTitle }) =>
  wrapper(`
    <h2 style="color:#0d2b2b; margin:0 0 12px;">Hi ${firstName}, thank you!</h2>
    <p style="color:#6b7280; font-size:14px; line-height:1.6;">
      We've received your donation request of <strong style="color:#0d2b2b;">₹${amount}</strong>
      ${causeTitle ? `towards <strong style="color:#0d2b2b;">${causeTitle}</strong>` : ""}.
      Click below to complete your payment securely.
    </p>
    <div style="text-align:center; margin:28px 0;">
      <a href="${paymentLink}"
         style="background:#e8490f; color:#ffffff; text-decoration:none; font-weight:700;
                letter-spacing:0.12em; text-transform:uppercase; font-size:12px;
                padding:14px 32px; border-radius:10px; display:inline-block;">
        Complete Donation
      </a>
    </div>
    <p style="color:#9ca3af; font-size:12px; line-height:1.6;">
      If the button doesn't work, copy and paste this link into your browser:<br/>
      <span style="color:#e8490f; word-break:break-all;">${paymentLink}</span>
    </p>
  `);

const adminNewDonationEmail = ({ firstName, lastName, amount, donationType, email, causeTitle }) =>
  wrapper(`
    <h2 style="color:#0d2b2b; margin:0 0 12px;">New donation request</h2>
    <table style="width:100%; font-size:13px; color:#374151; border-collapse:collapse;">
      <tr><td style="padding:6px 0; color:#9ca3af;">Name</td><td style="text-align:right;">${firstName} ${lastName}</td></tr>
      <tr><td style="padding:6px 0; color:#9ca3af;">Email</td><td style="text-align:right;">${email}</td></tr>
      <tr><td style="padding:6px 0; color:#9ca3af;">Amount</td><td style="text-align:right;">₹${amount}</td></tr>
      <tr><td style="padding:6px 0; color:#9ca3af;">Type</td><td style="text-align:right;">${donationType}</td></tr>
      ${causeTitle ? `<tr><td style="padding:6px 0; color:#9ca3af;">Cause</td><td style="text-align:right;">${causeTitle}</td></tr>` : ""}
    </table>
  `);

const contactNotificationEmail = ({ name, email, phone, subject, message }) =>
  wrapper(`
    <h2 style="color:#0d2b2b; margin:0 0 12px;">New contact message</h2>
    <table style="width:100%; font-size:13px; color:#374151; border-collapse:collapse; margin-bottom:16px;">
      <tr><td style="padding:6px 0; color:#9ca3af;">Name</td><td style="text-align:right;">${name}</td></tr>
      <tr><td style="padding:6px 0; color:#9ca3af;">Email</td><td style="text-align:right;">${email}</td></tr>
      ${phone ? `<tr><td style="padding:6px 0; color:#9ca3af;">Phone</td><td style="text-align:right;">${phone}</td></tr>` : ""}
      ${subject ? `<tr><td style="padding:6px 0; color:#9ca3af;">Subject</td><td style="text-align:right;">${subject}</td></tr>` : ""}
    </table>
    <p style="color:#374151; font-size:13px; line-height:1.6; background:#f5f2eb; padding:14px; border-radius:10px;">
      ${message}
    </p>
  `);

const volunteerApplicationEmail = ({ fullName, email, phone, areaOfInterest, availability, message }) =>
  wrapper(`
    <h2 style="color:#0d2b2b; margin:0 0 12px;">New volunteer application</h2>
    <table style="width:100%; font-size:13px; color:#374151; border-collapse:collapse; margin-bottom:16px;">
      <tr><td style="padding:6px 0; color:#9ca3af;">Name</td><td style="text-align:right;">${fullName}</td></tr>
      <tr><td style="padding:6px 0; color:#9ca3af;">Email</td><td style="text-align:right;">${email}</td></tr>
      <tr><td style="padding:6px 0; color:#9ca3af;">Phone</td><td style="text-align:right;">${phone}</td></tr>
      ${areaOfInterest ? `<tr><td style="padding:6px 0; color:#9ca3af;">Interest</td><td style="text-align:right;">${areaOfInterest}</td></tr>` : ""}
      ${availability ? `<tr><td style="padding:6px 0; color:#9ca3af;">Availability</td><td style="text-align:right;">${availability}</td></tr>` : ""}
    </table>
    ${message ? `<p style="color:#374151; font-size:13px; line-height:1.6; background:#f5f2eb; padding:14px; border-radius:10px;">${message}</p>` : ""}
  `);

module.exports = {
  donationLinkEmail,
  adminNewDonationEmail,
  contactNotificationEmail,
  volunteerApplicationEmail,
};
