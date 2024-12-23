import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  SALT: process.env.SALT || '',
  API_KEY: process.env.API_KEY || '',
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN || '',
  C_API_KEY: process.env.C_API_KEY || '',
  COLLECTION_NAME: process.env.COLLECTION_NAME || '',
  DB_NAME: process.env.DB_NAME || '',
  VOYAGE_API_KEY: process.env.VOYAGE_API_KEY || '',
} as const;

export default config;
