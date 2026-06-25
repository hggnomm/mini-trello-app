import { settings } from '../../utils/settings';
import { logger } from "../../utils/logger";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: settings.SMTP.HOST,
  port: settings.SMTP.PORT,
  secure: settings.SMTP.PORT === 465,
  auth: {
    user: settings.SMTP.USER,
    pass: settings.SMTP.PASS,
  },
});

export const sendMail = async (to: any, sub: any, msg: any) => {
  try {
    await transporter.sendMail({
      to: to,
      subject: sub,
      html: msg,
    });
    logger.info("email sent");
  } catch (error) {
    logger.error(error as Error, "Error sending email via nodemailer");
    throw error;
  }
};
