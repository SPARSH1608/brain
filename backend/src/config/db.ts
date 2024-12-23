import { MongoClient } from 'mongodb';
import config from './server.config';

export const connectDB = async (url: string) => {
  try {
    const client = await new MongoClient(url);
    console.log('Connected to MongoDB');

    const db = client.db(config.DB_NAME);
    const collection = db.collection(config.COLLECTION_NAME);
    // await collection.dropIndexes();

    // // // Create the vector index for 'embeddings' field
    // const index = {
    //   name: 'vector_index',
    //   type: 'vectorSearch',
    //   definition: {
    //     fields: [
    //       {
    //         type: 'vector',
    //         numDimensions: 1536, // Adjust to match your embedding's dimensions
    //         path: 'embeddings', // Field where embeddings are stored
    //         similarity: 'dotProduct', // Similarity type, can be cosine or dotProduct
    //       },
    //     ],
    //   },
    // };

    // // Create the index
    // const result = await collection.createSearchIndex(index);
    // console.log(`Vector index created: ${JSON.stringify(result)}`);
  } catch (error) {
    console.error('Error while connecting to DB or creating index:', error);
  }
};
