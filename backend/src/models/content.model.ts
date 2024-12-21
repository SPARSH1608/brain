import mongoose from 'mongoose';

const contentTypes = ['image', 'video', 'audio', 'text', 'articles'];
const contentSchema = new mongoose.Schema({
  link: { type: String, required: true },
  title: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag', required: true }],
  type: { type: String, required: true, enum: contentTypes },
});

export const Content = new mongoose.Model('Content', contentSchema);
