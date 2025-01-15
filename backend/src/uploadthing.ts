import { createUploadthing, type FileRouter } from 'uploadthing/server';
import { Request, Response } from 'express';
const f = createUploadthing();

export const uploadRouter = {
  singleMediaUpload: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
    video: { maxFileSize: '32MB', maxFileCount: 1 },
    audio: { maxFileSize: '8MB', maxFileCount: 1 },
  }).onUploadComplete((data, req: Request, res: Response) => {
    // This code runs on your server after upload
    console.log('File URL:', data);
    return res.json({ url: data.file.url });
  }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
