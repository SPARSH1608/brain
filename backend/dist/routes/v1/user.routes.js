"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../controllers/user.controller");
const middleware_1 = __importDefault(require("../../middlewares/middleware"));
const content_controller_1 = require("../../controllers/content.controller");
const share_controller_1 = require("../../controllers/share.controller");
const router = express_1.default.Router();
router.post('/signup', user_controller_1.createUser);
router.post('/signin', user_controller_1.login);
router.post('/content', middleware_1.default, content_controller_1.createContent);
router.get('/content', middleware_1.default, content_controller_1.getContents);
router.delete('/content', middleware_1.default, content_controller_1.deleteContent);
router.post('/brain/share', middleware_1.default, share_controller_1.createLink);
router.get('/brain/:shareLink', share_controller_1.sharedLink);
exports.default = router;
