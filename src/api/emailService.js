const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',           // or 'sendgrid', 'mailgun', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // App password for Gmail
  }
});

const sendNotification = async (to, subject, html, channel = 'email') => {
  if (channel === 'email') {
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  }
  // Add Slack / Twilio logic here later
};

module.exports = { sendNotification };
