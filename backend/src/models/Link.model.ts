import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  link: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

export const Link = new mongoose.Model('Link', linkSchema);
