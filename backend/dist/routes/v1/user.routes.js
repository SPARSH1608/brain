"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const user_controller_1 = require("../../controllers/user.controller");
const middleware_1 = __importDefault(require("../../middlewares/middleware"));
const content_controller_1 = require("../../controllers/content.controller");
const share_controller_1 = require("../../controllers/share.controller");
const router = express_1.default.Router();
router.post('/signup', user_controller_1.createUser);
router.post('/signin', user_controller_1.login);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB file size limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'video/mp4',
            'audio/mpeg',
            'audio/wav',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept file
        }
        else {
            cb(null, false); // Reject file
        }
    },
});
router.post('/content', middleware_1.default, upload.single('files'), content_controller_1.createContent);
router.get('/content', middleware_1.default, content_controller_1.getContents);
router.delete('/content', middleware_1.default, content_controller_1.deleteContent);
router.post('/brain/share', middleware_1.default, share_controller_1.createLink);
router.get('/brain/:shareLink', share_controller_1.sharedLink);
router.get('/search', middleware_1.default, content_controller_1.searchContent);
router.get('/searchcontent', middleware_1.default, content_controller_1.findContents);
exports.default = router;
