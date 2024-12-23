import mongoose, { model, Schema } from 'mongoose';
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //   clerkId: { type: String, required: true },
});

export const User = model('User', userSchema);
