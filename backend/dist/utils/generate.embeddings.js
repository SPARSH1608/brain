"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbeddings = generateEmbeddings;
const generative_ai_1 = require("@google/generative-ai");
const server_config_1 = __importDefault(require("../config/server.config"));
const genAI = new generative_ai_1.GoogleGenerativeAI(server_config_1.default.API_KEY);
const model1 = genAI.getGenerativeModel({ model: 'text-embedding-004' });
function generateEmbeddings(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield model1.embedContent(input);
            return result.embedding.values; // Embedding values
        }
        catch (error) {
            console.error('Error generating embeddings:', error);
            return null;
        }
    });
}
