import config from '../config/server.config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(config.API_KEY);
const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generates a relevant and up-to-date response for the given query and context using the Gemini API.
 * @param param0 The object containing the prompt and context.
 * @param param0.query The query to answer.
 * @param param0.context The context to enhance the response.
 * @returns A precise and concise response based on the query and context.
 */
export async function generateResponse({
  query,
  context,
}: {
  query: string;
  context: Number[][];
}): Promise<string> {
  console.log('Query:', query);
  console.log('Context:', context);

  const prompt = `
  You are a highly intelligent system that processes and utilizes context to generate precise and relevant responses.

  Context:
  The following context consists of embeddings that represent key pieces of information related to the query. These embeddings contain relevant knowledge that can be used to provide a more accurate and informed response. Please review the context thoroughly and use it to enhance your answer.

  ${context}

  Query: ${query}

  Your response should:
  - Leverage the given context (embeddings) to provide the most relevant and accurate information.
  - Ensure the response directly addresses the query, using the context to provide insight.
  - Avoid redundant or irrelevant information, focusing only on what is necessary to answer the query effectively.
  - Be clear, concise, and comprehensive, providing a complete answer based on the context provided.
`;

  try {
    // Generate content using the Gemini model
    const result = await model2.generateContent(prompt);
    const text = await result.response.text(); // Invoke the function to get the text response
    return text;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate a response.');
  }
}
