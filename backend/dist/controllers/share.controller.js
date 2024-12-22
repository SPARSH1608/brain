"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedLink = exports.createLink = void 0;
const Link_model_1 = require("../models/Link.model");
const generate_hash_1 = require("../utils/generate.hash");
const content_model_1 = require("../models/content.model");
const createLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId || '';
        const { share } = req.body;
        if (share) {
            const existingLink = yield Link_model_1.Link.findOne({ userId: userId });
            if (existingLink) {
                res.status(200).json({
                    success: true,
                    message: `Link already exists`,
                    data: existingLink.hash,
                });
                return;
            }
            const link = yield Link_model_1.Link.create({
                userId: userId,
                hash: (0, generate_hash_1.createHash)(userId),
            });
            res.status(200).json({
                success: true,
                message: `Link created successfully`,
                data: link.hash,
            });
            return;
        }
        yield Link_model_1.Link.deleteOne({ userId: userId });
        res
            .status(200)
            .json({ success: true, message: `Link removed successfully` });
        return;
    }
    catch (error) {
        console.error('Error creating link:', error);
        res.status(500).json({ success: false, message: 'Error creating link' });
        return;
    }
});
exports.createLink = createLink;
const sharedLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shareLink } = req.params;
        const link = yield Link_model_1.Link.findOne({ hash: shareLink }).populate('userId');
        if (!link) {
            res.status(404).json({ success: false, message: 'Link not found' });
            return;
        }
        const userId = link.userId;
        if (!userId) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const content = yield content_model_1.Content.find({ userId: userId });
        res.status(200).json({ success: true, data: content });
        return;
    }
    catch (error) {
        console.error('Error retrieving content by share link:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving content by share link',
        });
        return;
    }
});
exports.sharedLink = sharedLink;
