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
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const server_config_1 = __importDefault(require("./server.config"));
const connectDB = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(url);
        console.log('Database connected successfully');
        console.log(server_config_1.default.IS_VECTOR);
        if (Boolean(server_config_1.default.IS_VECTOR)) {
            const client = new mongodb_1.MongoClient(url);
            yield client.connect();
            const database = client.db(server_config_1.default.DB_NAME);
            const collection = database.collection(server_config_1.default.COLLECTION_NAME);
            // Define the index
            const index = {
                name: 'vector_index',
                type: 'vectorSearch',
                definition: {
                    fields: [
                        {
                            type: 'vector',
                            numDimensions: 1024, // Change this based on the dimensions of your embeddings
                            path: 'embeddings', // The field name storing the vector embeddings
                            similarity: 'cosine', // or "cosine" based on your similarity preference
                            quantization: 'scalar',
                        },
                    ],
                },
            };
            // Create the index
            const result = yield collection.createSearchIndex(index);
            console.log(`New search index named ${result} is building.`);
        }
    }
    catch (error) {
        console.log('Error connecting to database: ', error);
    }
});
exports.connectDB = connectDB;
