import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  SALT: process.env.SALT || '',
  API_KEY: process.env.API_KEY || '',
} as const;

export default config;
