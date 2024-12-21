import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

export const Tag = new mongoose.Model('Tag', tagSchema);
