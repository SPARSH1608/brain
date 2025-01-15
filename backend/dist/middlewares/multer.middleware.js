"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer = require('multer');
const path = require('path');
// Allowed file types
const allowedMimeTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    video: ['video/mp4', 'video/mkv', 'video/avi'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Set upload folder
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const fileFilter = (fileTypes) => {
    return (req, file, cb) => {
        if (fileTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        }
        else {
            cb(new Error(`Unsupported file type: ${file.mimetype}`), false); // Reject the file
        }
    };
};
// Reusable middleware generator
const uploadMiddleware = ({ type, maxFileSize, }) => {
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
exports.uploadMiddleware = uploadMiddleware;
