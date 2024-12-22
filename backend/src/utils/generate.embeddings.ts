import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/server.config';
const genAI = new GoogleGenerativeAI(config.API_KEY);
const model1 = genAI.getGenerativeModel({ model: 'text-embedding-004' });
export async function generateEmbeddings(input: string) {
  try {
    const result = await model1.embedContent(input);
    return result.embedding.values; // Embedding values
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return null;
  }
}
