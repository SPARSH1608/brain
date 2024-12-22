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
exports.generateTags = generateTags;
const server_config_1 = __importDefault(require("../config/server.config"));
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(server_config_1.default.API_KEY);
const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
function generateTags(input) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('input provided', input);
        const prompt = `
        You are an intelligent system that generates relevant and concise tags for the following input. 
        The input can be a text, link, image description, audio description, or video description.

        Input:  ${input}

        Provide tags separated by commas.
    `;
        try {
            // Generate content using the Gemini model
            const result = yield model2.generateContent(prompt);
            // Extract and return the tags
            return result.response.text(); // The tags will be returned as a single string
        }
        catch (error) {
            console.error('Error generating tags:', error);
            return 'Error generating tags.';
        }
    });
}
