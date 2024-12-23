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
exports.generateResponse = generateResponse;
const server_config_1 = __importDefault(require("../config/server.config"));
const generative_ai_1 = require("@google/generative-ai");
// Initialize the Gemini API
const genAI = new generative_ai_1.GoogleGenerativeAI(server_config_1.default.API_KEY);
const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
/**
 * Generates a relevant and up-to-date response for the given query and context using the Gemini API.
 * @param param0 The object containing the prompt and context.
 * @param param0.query The query to answer.
 * @param param0.context The context to enhance the response.
 * @returns A precise and concise response based on the query and context.
 */
function generateResponse(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, context, }) {
        console.log('Query:', query);
        console.log('Context:', context);
        const prompt = `
  You are a highly intelligent system that processes and utilizes context to generate precise and relevant responses.

  Context:
  The following context consists of embeddings that represent key pieces of information related to the query. These embeddings contain relevant knowledge that can be used to provide a more accurate and informed response. Please review the context thoroughly and use it to enhance your answer.

  ${context}

  Query: ${query}

  Your response should:
  - Leverage the given context (embeddings) to provide the most relevant and accurate information.
  - Ensure the response directly addresses the query, using the context to provide insight.
  - Avoid redundant or irrelevant information, focusing only on what is necessary to answer the query effectively.
  - Be clear, concise, and comprehensive, providing a complete answer based on the context provided.
`;
        try {
            // Generate content using the Gemini model
            const result = yield model2.generateContent(prompt);
            const text = yield result.response.text(); // Invoke the function to get the text response
            return text;
        }
        catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate a response.');
        }
    });
}
