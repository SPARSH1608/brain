import fs from 'fs';
import axios from 'axios';
import config from '../config/server.config';

// Hugging Face API configuration
const API_TOKEN = config.API_KEY_HUGGING_FACE;
const HEADERS = { Authorization: `Bearer ${API_TOKEN}` };

// API Endpoints
const IMAGE_MODEL_URL =
  'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning';
const AUDIO_MODEL_URL =
  'https://api-inference.huggingface.co/models/openai/whisper-large-v3';
const TEXT_SUMMARY_MODEL_URL =
  'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

// Function to query Hugging Face API
async function queryHuggingFaceAPI(
  modelUrl: string,
  fileData: Buffer
): Promise<any> {
  const response = await axios.post(modelUrl, fileData, {
    headers: {
      ...HEADERS,
      'Content-Type': 'application/octet-stream',
    },
  });
  return response.data;
}

// Function to summarize text
async function summarizeText(text: string): Promise<string> {
  const response = await axios.post(
    TEXT_SUMMARY_MODEL_URL,
    { inputs: text },
    { headers: { Authorization: `Bearer ${API_TOKEN}` } }
  );
  return response.data?.summary_text || 'No summary available.';
}

// Function to process images
async function processImage(
  imagePath: string,
  fileData: Buffer
): Promise<{ title: string; description: string; summary: string }> {
  const response = await queryHuggingFaceAPI(IMAGE_MODEL_URL, fileData);
  const description = response?.generated_text || 'No description available.';
  const title = description.split('.')[0]; // First sentence as the title
  const summary = await summarizeText(description);

  return { title, description, summary };
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
export async function processMedia(
  mediaPath: string,
  mediaType: 'image' | 'audio' | 'video',
  fileData: Buffer
) {
  try {
    let metadata;
    if (mediaType === 'image') {
      metadata = await processImage(mediaPath, fileData);
      // } else if (mediaType === 'audio') {
      //   metadata = await processAudio(mediaPath);
      // } else if (mediaType === 'video') {
      //   metadata = await processVideo(mediaPath);
    } else {
      throw new Error(
        "Unsupported media type. Use 'image', 'audio', or 'video'."
      );
    }

    console.log('Generated Metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error processing media:', error);
    throw error;
  }
}

// Example Usage
