import mongoose, { model, Schema, Document } from 'mongoose';
export interface IContentCount extends Document {
  userId: mongoose.Types.ObjectId;
  images: mongoose.Types.ObjectId[];
  links: mongoose.Types.ObjectId[];
  audio: mongoose.Types.ObjectId[];
  videos: mongoose.Types.ObjectId[];
  twitter: mongoose.Types.ObjectId[];
  youtube: mongoose.Types.ObjectId[];
}

const ContentCountSchema: Schema = new Schema<IContentCount>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    audio: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    twitter: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    youtube: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  },
  {
    timestamps: true,
  }
);

export const contentCount = model('ContentCount', ContentCountSchema);
