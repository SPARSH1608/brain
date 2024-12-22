import mongoose, { model, Schema } from 'mongoose';

const tagSchema = new Schema({
  title: { type: String, required: true },
});

export const Tag = model('Tag', tagSchema);
