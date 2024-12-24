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
exports.vectorSearch = vectorSearch;
const generate_embeddings_1 = require("./generate.embeddings");
function vectorSearch(query, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        // Generate query embedding
        const queryEmbedding = yield (0, generate_embeddings_1.generateVoyageAIEmbeddings)(query);
        if (!queryEmbedding) {
            throw new Error('Failed to generate query embeddings');
        }
        const pipeline = [
            {
                $vectorSearch: {
                    index: 'vector_index',
                    queryVector: queryEmbedding,
                    path: 'embeddings',
                    numCandidates: 1000,
                    limit: 1000,
                },
            },
            {
                $project: {
                    _id: 1,
                    contentId: 1,
                    embeddings: 1,
                    score: { $meta: 'vectorSearchScore' },
                },
            },
        ];
        // Execute the aggregation pipeline to fetch the embeddings and scores
        const results = yield collection.aggregate(pipeline).toArray();
        console.log('Results:', results);
        return results;
    });
}
