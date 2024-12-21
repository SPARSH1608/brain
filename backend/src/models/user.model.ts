import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  clerkId: { type: String, required: true },
});

export const User = new mongoose.Model('User', userSchema);
