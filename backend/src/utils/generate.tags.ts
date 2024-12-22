import config from '../config/server.config';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(config.API_KEY);
const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateTags(input: any) {
  console.log('input provided', input);
  const prompt = `
        You are an intelligent system that generates relevant and concise tags for the following input. 
        The input can be a text, link, image description, audio description, or video description.

        Input:  ${input}

        Provide tags separated by commas.
    `;

  try {
    // Generate content using the Gemini model
    const result = await model2.generateContent(prompt);

    // Extract and return the tags
    return result.response.text(); // The tags will be returned as a single string
  } catch (error) {
    console.error('Error generating tags:', error);
    return 'Error generating tags.';
  }
}
