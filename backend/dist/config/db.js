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
exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const server_config_1 = __importDefault(require("./server.config"));
const connectDB = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield new mongodb_1.MongoClient(url);
        console.log('Connected to MongoDB');
        const db = client.db(server_config_1.default.DB_NAME);
        const collection = db.collection(server_config_1.default.COLLECTION_NAME);
        // await collection.dropIndexes();
        // // // Create the vector index for 'embeddings' field
        // const index = {
        //   name: 'vector_index',
        //   type: 'vectorSearch',
        //   definition: {
        //     fields: [
        //       {
        //         type: 'vector',
        //         numDimensions: 1536, // Adjust to match your embedding's dimensions
        //         path: 'embeddings', // Field where embeddings are stored
        //         similarity: 'dotProduct', // Similarity type, can be cosine or dotProduct
        //       },
        //     ],
        //   },
        // };
        // // Create the index
        // const result = await collection.createSearchIndex(index);
        // console.log(`Vector index created: ${JSON.stringify(result)}`);
    }
    catch (error) {
        console.error('Error while connecting to DB or creating index:', error);
    }
});
exports.connectDB = connectDB;
