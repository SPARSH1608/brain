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
exports.mainGenerateTags = mainGenerateTags;
const generative_ai_1 = require("@google/generative-ai");
const server_config_1 = __importDefault(require("../config/server.config"));
const genAI = new generative_ai_1.GoogleGenerativeAI(server_config_1.default.API_KEY);
const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
function mainGenerateTags(input) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Input provided:', input);
        // Refined prompt for better tag generation
        const prompt = `
    You are an advanced AI designed to create relevant, concise, and SEO-friendly hashtags for digital content. Analyze the following details carefully and generate only 3 or 4 accurate hashtags:

    Title: ${input.title}
    Description: ${input.description}
    Summary: ${input.summary}

    Instructions:
    1. Focus on the key topics, themes, and concepts from the title and description.
    2. Generate only  4 hashtags that are highly relevant and aligned with the content's context.
    3. Ensure the hashtags are concise, unique, and SEO-friendly.
    4. Avoid generic, redundant, or unrelated hashtags.
    5. Output the hashtags as a single comma-separated string.
   

    Generate Hashtags:
  `;
        try {
            // Use Gemini to generate tags
            const result = yield model2.generateContent(prompt);
            // Process and return the tags, ensuring only a single hash symbol
            let tags = result.response.text().trim();
            // Remove any extra hash symbols
            tags = tags.replace(/##/g, '#');
            console.log('Generated Tags:', tags);
            return tags;
        }
        catch (error) {
            console.error('Error generating tags:', error);
            return 'Error generating tags.';
        }
    });
}
