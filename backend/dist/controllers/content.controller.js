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
exports.getCount = exports.findContents = exports.searchContent = exports.deleteContent = exports.getContents = exports.createContent = void 0;
const content_model_1 = require("../models/content.model");
const embedding_model_1 = require("../models/embedding.model");
const mongodb_1 = require("mongodb");
const get_yt_content_1 = require("../utils/get.yt.content");
const generate_content_1 = require("../utils/generate.content");
const detect_content_1 = require("../utils/detect.content");
const generate_tags_1 = require("../utils/generate.tags");
const generate_embeddings_1 = require("../utils/generate.embeddings");
const generate_response_1 = require("../utils/generate.response");
const vector_search_1 = require("../utils/vector-search");
const server_config_1 = __importDefault(require("../config/server.config"));
const mainTag_1 = require("../utils/mainTag");
const tag_model_1 = require("../models/tag.model");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const generate_content_media_1 = require("../utils/generate.content.media");
const content_count_model_1 = require("../models/content.count.model");
const json_formatter_1 = require("../utils/json.formatter");
const UploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.default.uploader.upload(file.path, {
            resource_type: 'auto',
        });
        return result.secure_url;
    }
    catch (error) {
        console.log('error in uploadtoCloudinary', error);
        throw new Error('Error uploadiing to cloudinary');
    }
});
const fs = require('fs').promises;
function getFileBuffer(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filePath = file.path;
            const buffer = yield fs.readFile(filePath);
            console.log('File Buffer:', buffer);
            return buffer;
        }
        catch (error) {
            console.error('Error reading the file:', error);
        }
    });
}
const createContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log(req.body);
        const file = req.file;
        const isLink = req.body.isLink;
        const input = req.body.input;
        let fileUrl;
        console.log(file, input, isLink);
        let linkContent;
        const contentType = (0, detect_content_1.detectContentType)(file || input);
        console.log('Content Type:', contentType);
        if (isLink === 'false' && file) {
            fileUrl = yield UploadToCloudinary(file);
            console.log('fileUrl', fileUrl);
            const fileBuffer = yield getFileBuffer(file);
            console.log('fileBuffer', fileBuffer);
            if (contentType === 'image') {
                // linkContent = await processMedia(file.path, 'image', fileBuffer);
                let data = yield (0, generate_content_media_1.generateImageContent)(file.path);
                console.log('data', data);
                linkContent = yield (0, json_formatter_1.generateContentFromText)(data);
                // linkContent = await generateMediaMetadata(fileBuffer);
                // } else if (contentType === 'audio') {
                //   linkContent = await processMedia(file.path, 'audio');
                // } else if (contentType === 'video') {
                //   linkContent = await processMedia(file.path, 'video');
                // }
            }
            console.log('linkContent', linkContent);
        }
        else {
            // Handle link content
            if (input === null || input === void 0 ? void 0 : input.includes('youtu')) {
                linkContent = yield (0, get_yt_content_1.displayVideoInfo)(input);
            }
            else {
                linkContent = yield (0, generate_content_1.generateContent)(input);
            }
        }
        console.log('linkcontet', linkContent);
        const tags = yield (0, generate_tags_1.generateTags)(linkContent);
        console.log('Generated Tags:', tags);
        const mainTags = yield (0, mainTag_1.mainGenerateTags)(linkContent);
        const mainTagsArray = mainTags.split(',').map((tag) => tag.trim());
        const tagsArray = tags.split(',').map((tag) => tag.trim());
        console.log('mainTagsArray', mainTagsArray);
        // Save the content in the database based on detected type
        const content = new content_model_1.Content({
            userId: req.userId,
            type: (0, detect_content_1.detectContentType)(file || input),
            text: (0, detect_content_1.detectContentType)(file || input) === 'text' ? input : '', // Only if type is text
            link: (0, detect_content_1.detectContentType)(file || input) === 'link' ? input : '', // Only if type is a link
            fileUrl: (0, detect_content_1.detectContentType)(file || input) === 'image' ||
                (0, detect_content_1.detectContentType)(file || input) === 'video' ||
                (0, detect_content_1.detectContentType)(file || input) === 'audio'
                ? fileUrl
                : '', // Only for media files
            tags: tagsArray, // Save the tags array
            info: linkContent,
        });
        const savedContent = yield content.save();
        console.log('Content Saved', savedContent);
        const mainTagsDocument = new tag_model_1.Tag({
            contentId: content._id,
            title: mainTagsArray,
        });
        yield content_model_1.Content.updateOne({ _id: savedContent._id }, { mainTagId: mainTagsDocument._id });
        yield mainTagsDocument.save();
        //@ts-ignore
        let userDoc = yield content_count_model_1.contentCount.findOne({
            userId: savedContent.userId,
        });
        console.log('userDoc', userDoc);
        if (savedContent.type === 'link' && ((_a = savedContent.link) === null || _a === void 0 ? void 0 : _a.includes('youtu'))) {
            userDoc === null || userDoc === void 0 ? void 0 : userDoc.youtube.push(savedContent._id);
            userDoc === null || userDoc === void 0 ? void 0 : userDoc.links.push(savedContent._id);
        }
        else if (savedContent.type === 'link' &&
            ((_b = savedContent.link) === null || _b === void 0 ? void 0 : _b.includes('x.com'))) {
            userDoc === null || userDoc === void 0 ? void 0 : userDoc.twitter.push(savedContent._id);
            userDoc === null || userDoc === void 0 ? void 0 : userDoc.links.push(savedContent._id);
        }
        else if (savedContent.type === 'image') {
            userDoc === null || userDoc === void 0 ? void 0 : userDoc.images.push(savedContent._id);
        }
        else {
            userDoc === null || userDoc === void 0 ? void 0 : userDoc.links.push(savedContent._id);
        }
        yield userDoc.save();
        const embeddings = yield (0, generate_embeddings_1.generateVoyageAIEmbeddings)(file || input);
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
        console.error('Error:', error);
        res.status(500).json({ message: 'Content creation failed' });
    }
});
exports.createContent = createContent;
const getContents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { filter } = req.query;
        console.log('userId', userId);
        console.log('filter', filter);
        const contentIds = yield content_count_model_1.contentCount.find({
            userId: userId,
        });
        //@ts-ignore
        console.log('contentIds', contentIds[0][filter]);
        let content;
        if (filter) {
            content = yield content_model_1.Content.find({
                //@ts-ignore
                _id: { $in: contentIds[0][filter] },
            })
                .populate('userId', 'username')
                .populate('mainTagId', 'title');
        }
        else {
            content = yield content_model_1.Content.find({ userId: userId })
                .populate('userId', 'username')
                .populate('mainTagId', 'title');
        }
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
        console.log('content', content);
        yield content_count_model_1.contentCount.updateOne({ userId }, {
            $pull: {
                youtube: contentId,
                links: contentId,
                twitter: contentId,
                images: contentId,
            },
        });
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
const getCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const count = yield content_count_model_1.contentCount.find({
            userId: userId,
        });
        //@ts-ignore
        res.status(200).json({ success: true, data: count });
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
exports.getCount = getCount;
