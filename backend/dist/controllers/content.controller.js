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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findContents = exports.searchContent = exports.deleteContent = exports.getContents = exports.createContent = void 0;
const content_model_1 = require("../models/content.model");
const embedding_model_1 = require("../models/embedding.model");
const mongodb_1 = require("mongodb");
const get_yt_content_1 = require("../utils/get.yt.content");
const generate_content_1 = require("../utils/generate.content");
const detect_content_1 = require("../utils/detect.content");
const generate_tags_1 = require("../utils/generate.tags");
const generate_embeddings_1 = require("../utils/generate.embeddings");
const upload_file_1 = require("../utils/upload.file");
const generate_response_1 = require("../utils/generate.response");
const vector_search_1 = require("../utils/vector-search");
const server_config_1 = __importDefault(require("../config/server.config"));
const createContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Create Content:', req.body);
    console.log('user', req.userId);
    const contentInput = req.body;
    const contentType = (0, detect_content_1.detectContentType)(contentInput.input);
    console.log('contentType', contentType);
    let linkContent;
    let fileUrl;
    if (contentType === 'image' ||
        contentType === 'video' ||
        (contentType === 'audio' && contentInput.file)) {
        console.log('Uploading file...');
        fileUrl = yield (0, upload_file_1.upload)(contentInput.file); // Upload the file using the utility function
        console.log('File uploaded. File URL:', fileUrl);
        // Use the file URL to generate content
        linkContent = yield (0, generate_content_1.generateContent)(fileUrl);
    }
    else if (contentType === 'link' && contentInput.input.includes('youtu')) {
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
    if (linkContent === null) {
        res.status(400).json({
            message: 'Link content not found',
        });
        return;
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
            info: linkContent,
        });
        const savedContent = yield content.save();
        console.log('Content Saved', savedContent);
        const embeddings = yield (0, generate_embeddings_1.generateVoyageAIEmbeddings)(contentInput.input);
        if (embeddings) {
            // Step 3: Save the embeddings in the Embedding collection
            const embedding = new embedding_model_1.Embedding({
                contentId: savedContent._id,
                embeddings: embeddings,
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
const searchContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, tag } = req.body;
    const userId = req.userId;
    console.log('userId', userId);
    try {
        if (tag) {
            const contentByTag = yield content_model_1.Content.find({ tags: { $in: [tag] } });
            res.json({ results: contentByTag });
            return;
        }
        if (query) {
            console.log('Performing vector search...');
            const client = yield new mongodb_1.MongoClient(server_config_1.default.MONGO_URI);
            const db = client.db(server_config_1.default.DB_NAME);
            const collection = db.collection(server_config_1.default.COLLECTION_NAME);
            const indexes = yield collection.indexes();
            console.log('Indexes:', indexes);
            const searchResults = yield (0, vector_search_1.vectorSearch)(query, collection);
            console.log('Search Results:', searchResults);
            //const searchResults: {
            //contentId: string;
            //embeddings: number[];
            //score: number;
            // }[]
            const contextEmbeddingsIds = searchResults.map((result) => result.contentId);
            console.log('Context content ids retrieved:', contextEmbeddingsIds);
            let finalContext = [];
            const contextContent = yield Promise.all(contextEmbeddingsIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
                const ans = yield content_model_1.Content.findById(id);
                if (ans) {
                    finalContext.push(ans.info);
                }
            })));
            console.log('Generating final response...', finalContext);
            const finalResponse = yield (0, generate_response_1.generateResponse)({
                context: finalContext,
                query,
            });
            console.log('f', finalResponse);
            res.status(200).json({
                message: 'Search results',
                success: true,
                geminiResponse: finalResponse,
            });
            return;
        }
        res
            .status(400)
            .json({ success: false, message: 'Invalid search parameters' });
    }
    catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.searchContent = searchContent;
const findContents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, tag } = req.body;
    const userId = req.userId;
    console.log('userId', userId);
    try {
        if (tag) {
            const contentByTag = yield content_model_1.Content.find({ tags: { $in: [tag] } });
            res.json({ results: contentByTag });
            return;
        }
        if (query) {
            console.log('Performing vector search...');
            const client = yield new mongodb_1.MongoClient(server_config_1.default.MONGO_URI);
            const db = client.db(server_config_1.default.DB_NAME);
            const collection = db.collection(server_config_1.default.COLLECTION_NAME);
            const indexes = yield collection.indexes();
            console.log('Indexes:', indexes);
            const searchResults = yield (0, vector_search_1.vectorSearch)(query, collection);
            console.log('Search Results:', searchResults);
            //const searchResults: {
            //contentId: string;
            //embeddings: number[];
            //score: number;
            // }[]
            const contextEmbeddingsIds = searchResults.map((result) => result.contentId);
            console.log('Context content ids retrieved:', contextEmbeddingsIds);
            let finalContext = [];
            const contextContent = yield Promise.all(contextEmbeddingsIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
                const ans = yield content_model_1.Content.findById(id);
                if (ans) {
                    finalContext.push(ans.info);
                }
            })));
            console.log('Generating final response...', finalContext);
            res.status(200).json({
                message: 'Search results',
                success: true,
                data: finalContext,
            });
            return;
        }
        res
            .status(400)
            .json({ success: false, message: 'Invalid search parameters' });
    }
    catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.findContents = findContents;
