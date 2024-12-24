import config from '../config/server.config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(config.API_KEY);
const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
interface Info {
  title: string;
  description: string;
  summary?: string;
}
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
  context: Info[];
}): Promise<string> {
  console.log('Query:', query);
  console.log('Context:', context);

  const prompt = `You are a retrieval-augmented system designed to generate contextually relevant responses based on the most similar content from a knowledge base.

Input Format:
1. Context: An array of relevant content where each item contains:
   {
     "info": {
       "title": "Content title",
       "description": "Detailed content description",
       "summary": "Optional content summary"
     },
     
   }

2. Query: \${query}
Context:${context}

Instructions for Processing:
1. For each piece of relevant content:
   - Review the title, description, and summary (if available)
   - Consider the similarity score to weigh relevance
   - Extract key information that relates to the query

2. Response Generation:
   - Synthesize information from the most relevant content (highest similarity scores)
   - Ensure response directly addresses the query using available information
   - Maintain coherent flow between different pieces of content
   - Include relevant titles as citations when appropriate

Example Input:
{
  "relevant_content": [
    {
      "info": {
        "title": "Introduction to PostgreSQL",
        "description": "Comprehensive overview of PostgreSQL features...",
        "summary": "Key features and benefits of PostgreSQL"
      },
      
    }
  ],
  "query": ${query}
}`;

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
