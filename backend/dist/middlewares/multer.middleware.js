"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Set your upload directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Set the filename to include the timestamp for uniqueness
    },
});
// Multer file filter function
const fileFilter = (fileTypes) => {
    return (req, file, cb) => {
        if (fileTypes.includes(file.mimetype)) {
            cb(null, true); // Accept file
        }
        else {
            cb(new Error(`Unsupported file type: ${file.mimetype}`), false); // Reject file
        }
    };
};
// Middleware generator for image, video, or audio uploads
const uploadMiddleware = ({ type, maxFileSize, }) => {
    const mimeTypes = allowedMimeTypes[type]; // Define allowed mime types based on type
    if (!mimeTypes) {
        throw new Error(`Unsupported upload type: ${type}`);
    }
    return multer({
        storage,
        limits: {
            fileSize: maxFileSize || 50 * 1024 * 1024, // Default max size: 50MB
        },
        fileFilter: fileFilter(mimeTypes),
    }).single('file'); // Single file upload
};
exports.uploadMiddleware = uploadMiddleware;
