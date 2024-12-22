import mongoose, { model, Schema } from 'mongoose';

const linkSchema = new Schema({
  hash: { type: String, required: true },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
  },
});

export const Link = model('Link', linkSchema);
