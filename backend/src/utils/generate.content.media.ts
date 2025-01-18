import config from '../config/server.config';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: config.GROQ_API_KEY });

export async function generateImageContent(imageFilePath: string) {
  try {
    // Resolve the file path
    const resolvedPath = path.resolve(imageFilePath);

    // Detect the MIME type of the image
    const mimeType = mime.lookup(resolvedPath);
    if (!mimeType || !mimeType.startsWith('image/')) {
      throw new Error('Invalid file type. Only image files are supported.');
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(resolvedPath);

    // Convert the image to a Base64 Data URL
    const base64Image = `data:${mimeType};base64,${imageBuffer.toString(
      'base64'
    )}`;

    const chatCompletion = await groq.chat.completions.create({
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
  } catch (error) {
    console.error('Error generating image content:', error);
    throw new Error('Failed to generate image content.');
  }
}
