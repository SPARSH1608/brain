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
        const prompt = `You are a retrieval-augmented system designed to generate contextually relevant responses based on the most similar content from a knowledge base.

Input Format:
1. Context: An array of relevant content where each item contains:
   {
     "info": {
       "title": "Content title",
       "description": "Detailed content description",
       "summary": "Optional content summary"
     },
     
   }

2. Query: \${query}
Context:${context}

Instructions for Processing:
1. For each piece of relevant content:
   - Review the title, description, and summary (if available)
   - Consider the similarity score to weigh relevance
   - Extract key information that relates to the query

2. Response Generation:
   - Synthesize information from the most relevant content (highest similarity scores)
   - Ensure response directly addresses the query using available information
   - Maintain coherent flow between different pieces of content
   - Include relevant titles as citations when appropriate

Example Input:
{
  "relevant_content": [
    {
      "info": {
        "title": "Introduction to PostgreSQL",
        "description": "Comprehensive overview of PostgreSQL features...",
        "summary": "Key features and benefits of PostgreSQL"
      },
      
    }
  ],
  "query": ${query}
}`;
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
