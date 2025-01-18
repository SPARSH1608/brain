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
exports.processMedia = processMedia;
const axios_1 = __importDefault(require("axios"));
const server_config_1 = __importDefault(require("../config/server.config"));
// Hugging Face API configuration
const API_TOKEN = server_config_1.default.API_KEY_HUGGING_FACE;
const HEADERS = { Authorization: `Bearer ${API_TOKEN}` };
// API Endpoints
const IMAGE_MODEL_URL = 'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning';
const AUDIO_MODEL_URL = 'https://api-inference.huggingface.co/models/openai/whisper-large-v3';
const TEXT_SUMMARY_MODEL_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
// Function to query Hugging Face API
function queryHuggingFaceAPI(modelUrl, fileData) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.post(modelUrl, fileData, {
            headers: Object.assign(Object.assign({}, HEADERS), { 'Content-Type': 'application/octet-stream' }),
        });
        return response.data;
    });
}
// Function to summarize text
function summarizeText(text) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const response = yield axios_1.default.post(TEXT_SUMMARY_MODEL_URL, { inputs: text }, { headers: { Authorization: `Bearer ${API_TOKEN}` } });
        return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.summary_text) || 'No summary available.';
    });
}
// Function to process images
function processImage(imagePath, fileData) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queryHuggingFaceAPI(IMAGE_MODEL_URL, fileData);
        const description = (response === null || response === void 0 ? void 0 : response.generated_text) || 'No description available.';
        const title = description.split('.')[0]; // First sentence as the title
        const summary = yield summarizeText(description);
        return { title, description, summary };
    });
}
// // Function to process audio
// async function processAudio(
//   audioPath: string,
//   fileData: Buffer
// ): Promise<{ title: string; description: string; summary: string }> {
//   const response = await queryHuggingFaceAPI(AUDIO_MODEL_URL, fileData);
//   const description = response?.text || 'No transcription available.';
//   const title = description.split('.')[0]; // First sentence as the title
//   const summary = await summarizeText(description);
//   return { title, description, summary };
// }
// // Function to process videos
// async function processVideo(
//   videoPath: string
// ): Promise<{ title: string; description: string; summary: string }> {
//   const ffmpeg = require('fluent-ffmpeg');
//   const tempAudioPath = './temp_audio.wav';
//   // Extract audio from video
//   await new Promise((resolve, reject) => {
//     ffmpeg(videoPath)
//       .output(tempAudioPath)
//       .on('end', resolve)
//       .on('error', reject)
//       .run();
//   });
//   // Process extracted audio
//   const audioMetadata = await processAudio(tempAudioPath);
//   // Cleanup temporary audio file
//   fs.unlinkSync(tempAudioPath);
//   return audioMetadata;
// }
// Main Function to Process Media
function processMedia(mediaPath, mediaType, fileData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let metadata;
            if (mediaType === 'image') {
                metadata = yield processImage(mediaPath, fileData);
                // } else if (mediaType === 'audio') {
                //   metadata = await processAudio(mediaPath);
                // } else if (mediaType === 'video') {
                //   metadata = await processVideo(mediaPath);
            }
            else {
                throw new Error("Unsupported media type. Use 'image', 'audio', or 'video'.");
            }
            console.log('Generated Metadata:', metadata);
            return metadata;
        }
        catch (error) {
            console.error('Error processing media:', error);
            throw error;
        }
    });
}
// Example Usage
