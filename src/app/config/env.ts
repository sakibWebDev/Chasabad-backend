import dotenv from "dotenv";
import status from "http-status";
import AppError from "../errorHelpers/AppError";

dotenv.config();

export interface EnvConfig {
  SMTP_FROM_EMAIL: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;

  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  DIRECT_URL: string;

  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  FRONTEND_URL: string;

  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;

  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;

  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  // SSL_COMMERZ_STORE_ID: string;
  // SSL_COMMERZ_STORE_PASSWORD: string;
  // SSL_COMMERZ_IS_LIVE: string;
  // SSL_COMMERZ_SANDBOX_URL: string;
  // SSL_COMMERZ_LIVE_URL: string;
  // SSL_COMMERZ_SUCCESS_URL: string;
  // SSL_COMMERZ_FAIL_URL: string;
  // SSL_COMMERZ_CANCEL_URL: string;
  // SSL_COMMERZ_IPN_URL: string;




  EMAIL_SENDER: {
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_FROM: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",

    // "SSL_COMMERZ_STORE_ID",
    // "SSL_COMMERZ_STORE_PASSWORD",
    // "SSL_COMMERZ_IS_LIVE",
    //   "SSL_COMMERZ_SANDBOX_URL",
    //   "SSL_COMMERZ_LIVE_URL",
    //   "SSL_COMMERZ_SUCCESS_URL",
    //   "SSL_COMMERZ_FAIL_URL",
    //   "SSL_COMMERZ_CANCEL_URL",
    //   "SSL_COMMERZ_IPN_URL",


    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "FRONTEND_URL",

    "ACCESS_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRES_IN",

    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",

    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",

    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",

    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",

    "SMTP_FROM_EMAIL",

    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
  ];

  requiredEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV!,
    PORT: process.env.PORT!,
    DATABASE_URL: process.env.DATABASE_URL!,
    DIRECT_URL: process.env.DIRECT_URL!,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN!,

    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN!,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,

    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL!,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD!,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,

    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL!,

    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID!,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN!,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER!,
    

      // SSL_COMMERZ_STORE_ID: process.env.SSL_COMMERZ_STORE_ID!,
      // SSL_COMMERZ_STORE_PASSWORD: process.env.SSL_COMMERZ_STORE_PASSWORD!,
      // SSL_COMMERZ_IS_LIVE: process.env.SSL_COMMERZ_IS_LIVE!,
      // SSL_COMMERZ_SANDBOX_URL: process.env.SSL_COMMERZ_SANDBOX_URL!,
      // SSL_COMMERZ_LIVE_URL: process.env.SSL_COMMERZ_LIVE_URL!,
      // SSL_COMMERZ_SUCCESS_URL: process.env.SSL_COMMERZ_SUCCESS_URL!,
      // SSL_COMMERZ_FAIL_URL: process.env.SSL_COMMERZ_FAIL_URL!,
      // SSL_COMMERZ_CANCEL_URL: process.env.SSL_COMMERZ_CANCEL_URL!,
      // SSL_COMMERZ_IPN_URL: process.env.SSL_COMMERZ_IPN_URL!,

    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER!,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS!,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST!,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT!,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM!,
    },
  };
};

export const envVars = loadEnvVariables();