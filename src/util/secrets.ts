import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const production = process.env.ENV_MODE === 'prod';

export const DB_URI = production
  ? process.env.DB_PROD_URI
  : process.env.DB_URI;

if (!DB_URI) {
  console.error('DB connection string not found');
  process.exit(1);
}

export const SESSION_KEY = process.env.SESSION_KEY;

if (!SESSION_KEY) {
  console.error('Session string not found');
  process.exit(2);
}

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('Email service credentials not found');
  process.exit(3);
}
