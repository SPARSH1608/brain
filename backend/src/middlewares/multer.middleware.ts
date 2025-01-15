const multer = require('multer');
const path = require('path');
import { Request } from 'express';
import { StorageEngine } from 'multer';

// Allowed file types
const allowedMimeTypes = {
  image: ['image/jpeg', 'image/png', 'image/gif'],
  video: ['video/mp4', 'video/mkv', 'video/avi'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
};

// Multer storage configuration
interface MulterFile extends Express.Multer.File {
  originalname: string;
  mimetype: string;
}

interface UploadMiddlewareOptions {
  type: keyof typeof allowedMimeTypes;
  maxFileSize?: number;
  maxFiles?: number;
}

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: MulterFile,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, path.join(__dirname, '../uploads')); // Set upload folder
  },
  filename: (
    req: Request,
    file: MulterFile,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File validation
interface FileFilterCallback {
  (error: Error | null, acceptFile: boolean): void;
}

interface FileFilter {
  (req: Request, file: MulterFile, cb: FileFilterCallback): void;
}

const fileFilter = (fileTypes: string[]): FileFilter => {
  return (req: Request, file: MulterFile, cb: FileFilterCallback) => {
    if (fileTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false); // Reject the file
    }
  };
};

// Reusable middleware generator
export const uploadMiddleware = ({
  type,
  maxFileSize,
}: UploadMiddlewareOptions) => {
  const mimeTypes = allowedMimeTypes[type];

  if (!mimeTypes) {
    throw new Error(`Unsupported upload type: ${type}`);
  }

  return multer({
    storage,
    limits: {
      fileSize: maxFileSize || 50 * 1024 * 1024, // Default max size: 50MB
    },
    fileFilter: fileFilter(mimeTypes),
  }).single('file'); // Use `.array()` for multiple files
};
