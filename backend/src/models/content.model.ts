import mongoose, { model, Schema } from 'mongoose';

const contentTypes = ['image', 'video', 'audio', 'text', 'link'];
const contentSchema = new Schema({
  link: { type: String },
  text: { type: String },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String, required: true }],
  type: { type: String, required: true, enum: contentTypes },
  fileUrl: { type: String },
});

export const Content = model('Content', contentSchema);
