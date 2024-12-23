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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVoyageAIEmbeddings = generateVoyageAIEmbeddings;
const voyageai_1 = require("voyageai");
// Initialize the client with your API key
const client = new voyageai_1.VoyageAIClient({
    apiKey: 'pa-EQbvh2_fRdGPDMWEOI7FQzV31qPJOYyC2_yW8Khl_Xks',
});
// Function to generate embeddings
function generateVoyageAIEmbeddings(input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Make the request to generate embeddings
            const response = yield client.embed({
                input: [input], // For batch processing, you can add more inputs in the array
                model: 'voyage-2', // Use the appropriate model
            });
            // Return the embeddings from the response
            //@ts-ignore
            return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.embeddings; // Assuming the first embedding is the desired result
        }
        catch (err) {
            // Handle any errors
            if (err instanceof voyageai_1.VoyageAIError) {
                console.log('Error Status Code:', err.statusCode);
                console.log('Error Message:', err.message);
                console.log('Error Body:', err.body);
            }
            else {
                console.error('Unexpected Error:', err);
            }
            return null;
        }
    });
}
const input = 'Sample text for embedding';
generateVoyageAIEmbeddings(input)
    .then((embedding) => {
    if (embedding) {
        console.log('Generated Embedding:', embedding);
    }
    else {
        console.log('Failed to generate embedding.');
    }
})
    .catch((error) => {
    console.error('Error generating embedding:', error);
});
