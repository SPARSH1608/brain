import mongoose, { model, Schema } from 'mongoose';

const tagSchema = new Schema({
  title: { type: Array, required: true },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
  },
});

export const Tag = model('Tag', tagSchema);
