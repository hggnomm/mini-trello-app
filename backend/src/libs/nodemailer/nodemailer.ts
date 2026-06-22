import { logger } from "../../utils/logger";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = (to: any, sub: any, msg: any) => {
  transporter.sendMail({
    to: to,
    subject: sub,
    html: msg,
  });

  logger.info("email sent");
};
