import mongoose from 'mongoose';

export const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log('Database connected successfully');
  } catch (error) {
    console.log('Error connecting to database: ', error);
  }
};
