import mongoose from 'mongoose';
export const connectDB = async (url: string) => {
  const conn = await mongoose.connect(url);
  console.log(`connected to db `);
};
