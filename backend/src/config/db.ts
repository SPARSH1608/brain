import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
export const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
    // const index = {
    //   name: 'vector_index',
    //   type: 'vectorSearch',
    //   definition: {
    //     fields: [
    //       {
    //         type: 'vector',
    //         numDimensions: 1536,
    //         path: 'plot_embedding',
    //         similarity: 'dotProduct',
    //       },
    //     ],
    //   },
    // };
    // const result = await collection.createSearchIndex(index);
    // console.log(`Vector index created: ${result}`);
  } catch (error) {
    console.error('error while connecting to db', error);
  }
};
