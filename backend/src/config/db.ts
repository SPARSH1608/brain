import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import config from './server.config';

export const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log('Database connected successfully');

    console.log(config.IS_VECTOR);
    if (Boolean(config.IS_VECTOR)) {
      const client = new MongoClient(url);
      await client.connect();
      const database = client.db(config.DB_NAME);
      const collection = database.collection(config.COLLECTION_NAME);

      // Define the index
      const index = {
        name: 'vector_index',
        type: 'vectorSearch',
        definition: {
          fields: [
            {
              type: 'vector',
              numDimensions: 1024, // Change this based on the dimensions of your embeddings
              path: 'embeddings', // The field name storing the vector embeddings
              similarity: 'cosine', // or "cosine" based on your similarity preference
              quantization: 'scalar',
            },
          ],
        },
      };

      // Create the index
      const result = await collection.createSearchIndex(index);
      console.log(`New search index named ${result} is building.`);
    }
  } catch (error) {
    console.log('Error connecting to database: ', error);
  }
};
