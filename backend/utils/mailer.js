// utils/mailer.js
// Handles sending emails with Nodemailer and SendGrid

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

// --- OPTIMIZATION APPLIED HERE ---
// Create the transporter object once, outside of the sendEmail function.
// This allows the connection to be reused, which is much faster.
const transporter = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

const sendEmail = async (options) => {
  // 2) Define the email options
  const mailOptions = {
    from: `Skillshare <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // 3) Use the pre-existing transporter to send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
