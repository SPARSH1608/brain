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
exports.deleteContent = exports.getContents = exports.createContent = void 0;
const content_model_1 = require("../models/content.model");
const embedding_model_1 = require("../models/embedding.model");
const get_yt_content_1 = require("../utils/get.yt.content");
const generate_content_1 = require("../utils/generate.content");
const detect_content_1 = require("../utils/detect.content");
const generate_tags_1 = require("../utils/generate.tags");
const generate_embeddings_1 = require("../utils/generate.embeddings");
// Initialize the Generative AI instance with your API key
const createContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Create Content:', req.body);
    console.log('user', req.userId);
    const contentInput = req.body;
    const contentType = (0, detect_content_1.detectContentType)(contentInput.input);
    console.log('contentType', contentType);
    let linkContent;
    if (contentType === 'link' && contentInput.input.includes('youtu')) {
        const videoId = (0, get_yt_content_1.extractVideoId)(contentInput.input);
        console.log('YouTube Video ID:', videoId);
        if (videoId) {
            // Fetch video info using YouTube API
            linkContent = yield (0, get_yt_content_1.displayVideoInfo)(contentInput.input);
            console.log('YouTube Video Info:', linkContent);
        }
    }
    else {
        // Otherwise, handle other types of links (image, video, audio, webpage)
        linkContent = yield (0, generate_content_1.generateContent)(contentInput.input);
        console.log('Link Content:', linkContent);
    }
    try {
        // Generate tags based on the content input
        const tags = yield (0, generate_tags_1.generateTags)(linkContent);
        console.log('Generated Tags:', tags);
        // If generateTags returns a single string, split it into an array
        const tagsArray = tags.split(',').map((tag) => tag.trim());
        // Save the content in the database based on detected type
        const content = new content_model_1.Content({
            userId: req.userId,
            type: contentType,
            text: contentType === 'text' ? contentInput.input : '', // Only if type is text
            link: contentType === 'link' ? contentInput.input : '', // Only if type is a link
            fileUrl: contentType === 'image' ||
                contentType === 'video' ||
                contentType === 'audio'
                ? contentInput.input
                : '', // Only for media files
            tags: tagsArray, // Save the tags array
        });
        const savedContent = yield content.save();
        console.log('Content Saved', savedContent);
        const embeddings = yield (0, generate_embeddings_1.generateEmbeddings)(contentInput.input);
        if (embeddings) {
            // Step 3: Save the embeddings in the Embedding collection
            const embedding = new embedding_model_1.Embedding({
                contentId: savedContent._id,
                embeddings: JSON.stringify(embeddings),
            });
            yield embedding.save();
            res.status(200).json({
                success: true,
                message: 'Content and embeddings saved successfully!',
            });
            return;
        }
        else {
            console.log('Error generating embeddings');
        }
    }
    catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
        return;
    }
});
exports.createContent = createContent;
const getContents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        console.log('userId', userId);
        const content = yield content_model_1.Content.find({ userId: userId });
        res.status(200).json({ success: true, data: content });
        return;
    }
    catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
        return;
    }
});
exports.getContents = getContents;
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentId = req.body.contentId;
        console.log('contentId', contentId);
        const userId = req.userId;
        console.log('userId', userId);
        const content = yield content_model_1.Content.findOne({ _id: contentId, userId: userId });
        if (!content) {
            res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this content',
            });
            return;
        }
        yield content_model_1.Content.deleteOne({ _id: contentId, userId: userId });
        res
            .status(200)
            .json({ success: true, message: 'Content deleted successfully' });
        return;
    }
    catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
        return;
    }
});
exports.deleteContent = deleteContent;
