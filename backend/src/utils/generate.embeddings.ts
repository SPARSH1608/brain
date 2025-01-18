import { VoyageAIClient, VoyageAIError } from 'voyageai';
import config from '../config/server.config';

// Initialize the VoyageAI client with your API key
const client = new VoyageAIClient({ apiKey: config.VOYAGE_API_KEY });

interface Info {
  title: string;
  description: string;
  summary?: string;
}

// Function to generate embeddings
export async function generateVoyageAIEmbeddings(
  input: string | Info
): Promise<number[] | null> {
  try {
    let processedInput: string;

    // Check if the input is an object of type Info
    if (typeof input === 'object' && input !== null) {
      // Combine the fields of the Info object into a single string for embedding
      processedInput = `${input.title}\n${input.description}${
        input.summary ? `\n${input.summary}` : ''
      }`;
    } else if (typeof input === 'string') {
      // Use the input directly if it's a string
      processedInput = input;
    } else {
      throw new Error(
        'Invalid input type. Expected a string or an object of type Info.'
      );
    }

    // Create a request to generate embeddings
    const response = await client.embed({
      input: processedInput, // Processed input
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
