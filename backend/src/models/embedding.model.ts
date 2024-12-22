import mongoose, { model, Schema } from 'mongoose';

const embeddingSchema = new Schema({
  contentId: { type: mongoose.Types.ObjectId, ref: 'Content', required: true },
  embeddings: { type: String, required: true },
});

export const Embedding = model('Embedding', embeddingSchema);
