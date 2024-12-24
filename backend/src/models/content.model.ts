import mongoose, { model, Schema } from 'mongoose';
interface Info {
  title: string;
  description: string;
  summary: string;
}

const infoSchema = new Schema<Info>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  summary: { type: String },
});
const contentTypes = ['image', 'video', 'audio', 'text', 'link'];
const contentSchema = new Schema({
  link: { type: String },
  text: { type: String },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String, required: true }],
  type: { type: String, required: true, enum: contentTypes },
  fileUrl: { type: String },
  info: { type: infoSchema, required: true },
});

export const Content = model('Content', contentSchema);
