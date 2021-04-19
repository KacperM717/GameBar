import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const production = process.env.ENV_MODE === 'prod';

export const PORT = production ? Number(process.env.PORT) : 5000;
export const HOST = production
  ? (process.env.HOST as string)
  : 'http://localhost';

export const DB_URI = ((production
  ? process.env.DB_PROD_URI
  : process.env.DB_URI) ?? '') as string;

if (!DB_URI) {
  console.error('DB connection string not found');
  process.exit(1);
}

export const SESSION_KEY = process.env.SESSION_KEY as string;

if (!SESSION_KEY) {
  console.error('Session string not found');
  process.exit(2);
}

export const EMAIL_USER = process.env.EMAIL_USER as string;
export const EMAIL_PASS = process.env.EMAIL_PASS as string;
export const EMAIL_HOST = process.env.EMAIL_HOST as string;
export const EMAIL_PORT = process.env.EMAIL_PORT as string;
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE as string;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('Email service credentials not found');
  process.exit(3);
}

export const SALT = 10;
export const JWT_SECRET = process.env.JWT_SECRET as string;
