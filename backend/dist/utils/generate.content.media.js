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
exports.generateImageContent = generateImageContent;
const server_config_1 = __importDefault(require("../config/server.config"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mime_types_1 = __importDefault(require("mime-types"));
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: server_config_1.default.GROQ_API_KEY });
function generateImageContent(imageFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Resolve the file path
            const resolvedPath = path_1.default.resolve(imageFilePath);
            // Detect the MIME type of the image
            const mimeType = mime_types_1.default.lookup(resolvedPath);
            if (!mimeType || !mimeType.startsWith('image/')) {
                throw new Error('Invalid file type. Only image files are supported.');
            }
            // Read the image file
            const imageBuffer = fs_1.default.readFileSync(resolvedPath);
            // Convert the image to a Base64 Data URL
            const base64Image = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
            const chatCompletion = yield groq.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Instructions for Processing:\n1. Analyze the media file to determine key features, themes, objects, sounds, or actions.\n2. Generate a title that is brief but descriptive.\n3. Generate a detailed description, covering key elements, emotions, or themes.\n4. Provide a short summary capturing the essence of the media.\n\nExample Output (for a video):\n{\n  "title": "An Amazing Sunset by the Beach",\n  "description": "This video captures the serene beauty of a sunset over the ocean. The waves crash gently onto the shore as the sky transitions from golden to purple hues. The calming sounds of the ocean waves enhance the peaceful atmosphere.",\n  "summary": "A peaceful video showcasing the beauty of a sunset over the beach, with soothing sounds of the ocean."\n}\n\nGenerate the metadata for the provided media file and return it in the format:\n{\n  "title": "Generated title of the media",\n  "summary": "Concise summary of the media",\n  "description": "Detailed description of the media"\n}',
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: base64Image,
                                },
                            },
                        ],
                    },
                ],
                model: 'llama-3.2-11b-vision-preview',
                temperature: 1,
                max_completion_tokens: 1024,
                top_p: 1,
                stream: false,
                stop: null,
            });
            const metadata = chatCompletion.choices[0].message.content;
            console.log('Generated Metadata:', metadata);
            return metadata;
        }
        catch (error) {
            console.error('Error generating image content:', error);
            throw new Error('Failed to generate image content.');
        }
    });
}
