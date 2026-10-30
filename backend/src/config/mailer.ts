import nodemailer, { Transporter } from "nodemailer";
import env from "./env.js";

let transporter: Transporter | null = null;

const emailPass = (process.env.EMAIL_PASS || (env as any).EMAIL_PASS || "") as string;

if (env.NODE_ENV !== "test" && env.EMAIL_USER && emailPass) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: emailPass,
    },
  });
}

export const sendMail = async (to: string, subject: string, text: string): Promise<void> => {
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
  } catch (error: any) {
    console.error(`[Mailer Error] Failed sending email to ${to}:`, error?.message || error);
  }
};

export default sendMail;
