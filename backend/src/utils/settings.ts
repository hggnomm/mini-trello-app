import dotenv from "dotenv";
import path from "path";

// Load environment variables immediately when this module is imported
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const settings = {
  PORT: Number(process.env.PORT) || 8000,
  JWT_SECRET: process.env.JWT_SECRET || "123123123",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
  SMTP: {
    HOST: process.env.SMTP_HOST || "",
    PORT: Number(process.env.SMTP_PORT) || 587,
    USER: process.env.SMTP_USER || "",
    PASS: process.env.SMTP_PASS || "",
  },
};
