// Import Google Generative AI library
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
// Initialize the Generative AI instance with your API key
const genAI = new GoogleGenerativeAI('AIzaSyBzJAvEMNiP35oHxWMeOQeGhZcuzRpoD9M');

// Select the model to use
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Function to generate tags
async function generateTags(input) {
  const prompt = `
        You are an intelligent system that generates relevant and concise tags for the following input. 
        The input can be a text, link, image description, audio description, or video description.

        Input: ${input}

        Provide tags separated by commas.
    `;

  try {
    // Generate content using the Gemini model
    const result = await model.generateContent(prompt);

    // Extract and return the tags
    return result.response.text(); // The tags will be returned as a single string
  } catch (error) {
    console.error('Error generating tags:', error);
    return 'Error generating tags.';
  }
}

// Example Input
const userInput = `
    https://www.mongodb.com/docs/atlas/atlas-vector-search/create-embeddings/
`;

// Generate and print tags
generateTags(userInput)
  .then((tags) => {
    console.log('Generated Tags:', tags);
  })
  .catch((err) => {
    console.error('Error:', err);
  });
