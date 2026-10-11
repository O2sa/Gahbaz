import nodemailer from "nodemailer";
import env from "./env.js";

let transporter = null;

if (env.EMAIL_USER && env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
}

export const sendMail = async (to, subject, text) => {
  if (!transporter) {
    console.warn(`[Mailer] Mailer not configured. Skipping email to ${to}`);
    return;
  }

  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`[Mailer Error] Failed sending email to ${to}:`, error.message);
  }
};

export default sendMail;
