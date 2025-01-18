"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
    YT_API: process.env.YT_API || '',
    IS_VECTOR: process.env.IS_VECTOR || false,
    API_KEY_HUGGING_FACE: process.env.API_KEY_HUGGING_FACE || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
};
exports.default = config;
