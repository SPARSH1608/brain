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
exports.generateVoyageAIEmbeddings = generateVoyageAIEmbeddings;
const voyageai_1 = require("voyageai");
const server_config_1 = __importDefault(require("../config/server.config"));
// Initialize the VoyageAI client with your API key
const client = new voyageai_1.VoyageAIClient({ apiKey: server_config_1.default.VOYAGE_API_KEY });
// Function to generate embeddings
function generateVoyageAIEmbeddings(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let processedInput;
            // Check if the input is an object of type Info
            if (typeof input === 'object' && input !== null) {
                // Combine the fields of the Info object into a single string for embedding
                processedInput = `${input.title}\n${input.description}${input.summary ? `\n${input.summary}` : ''}`;
            }
            else if (typeof input === 'string') {
                // Use the input directly if it's a string
                processedInput = input;
            }
            else {
                throw new Error('Invalid input type. Expected a string or an object of type Info.');
            }
            // Create a request to generate embeddings
            const response = yield client.embed({
                input: processedInput, // Processed input
                model: 'voyage-2', // The model to use (replace with the correct model name if needed)
            });
            //@ts-ignore
            console.log(response.data[0].embedding);
            // Return the embeddings array for the first input (or more if it's a batch request)
            //@ts-ignore
            return response.data[0].embedding; // Assuming the first result is the desired embedding
        }
        catch (err) {
            // Handle API errors gracefully
            if (err instanceof voyageai_1.VoyageAIError) {
                console.log('Error Status Code:', err.statusCode);
                console.log('Error Message:', err.message);
                console.log('Error Body:', err.body);
            }
            else {
                console.error('Unexpected Error:', err);
            }
            return null; // Return null if an error occurs
        }
    });
}
