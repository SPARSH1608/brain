import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/server.config';

const genAI = new GoogleGenerativeAI(config.API_KEY);
const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateTags(input: any): Promise<string> {
  console.log('Input provided:', input);

  // Refined prompt for better tag generation
  const prompt = `
    You are an advanced AI designed to create relevant, concise, and SEO-friendly tags for digital content. Analyze the following details carefully and generate accurate tags:

    Title: ${input.title}
    Description: ${input.description}
    summary: ${input.summary}

    Instructions:
    1. Focus on the key topics, themes, and concepts from the title and description.
    2. Ensure the tags are concise, relevant, and aligned with the context.
    3. Avoid generic or redundant tags like "undefined" or unrelated terms.
    4. Output the tags as a single comma-separated string.

    Generate Tags:
  `;

  try {
    // Use Gemini to generate tags
    const result = await model2.generateContent(prompt);

    // Process and return the tags
    const tags = result.response.text().trim();
    console.log('Generated Tags:', tags);
    return tags;
  } catch (error) {
    console.error('Error generating tags:', error);
    return 'Error generating tags.';
  }
}
