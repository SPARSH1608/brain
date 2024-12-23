import { VoyageAIClient, VoyageAIError } from 'voyageai';
import config from '../config/server.config';

// Initialize the VoyageAI client with your API key
const client = new VoyageAIClient({ apiKey: config.VOYAGE_API_KEY });

// Function to generate embeddings
export async function generateVoyageAIEmbeddings(
  input: string | string[]
): Promise<number[] | null> {
  try {
    // Create a request to generate embeddings
    const response = await client.embed({
      input, // Input text (single or array of strings)
      model: 'voyage-2', // The model to use (replace with the correct model name if needed)
    });
    //@ts-ignore
    console.log(response.data[0].embedding);
    // Return the embeddings array for the first input (or more if it's a batch request)
    //@ts-ignore
    return response.data[0].embedding; // Assuming the first result is the desired embedding
  } catch (err) {
    // Handle API errors gracefully
    if (err instanceof VoyageAIError) {
      console.log('Error Status Code:', err.statusCode);
      console.log('Error Message:', err.message);
      console.log('Error Body:', err.body);
    } else {
      console.error('Unexpected Error:', err);
    }
    return null; // Return null if an error occurs
  }
}
