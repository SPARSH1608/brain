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
                    index: 'vector_index', // Ensure the correct index name
                    queryVector: queryEmbedding, // The 1536-dimensional query vector
                    path: 'embeddings', // Field where the embeddings are stored in your collection
                    numCandidates: 900, // Number of candidates to consider
                    limit: 100, // Limit the number of results
                },
            },
            {
                $project: {
                    _id: 0, // Exclude _id field
                    contentId: 1, // Include contentId field
                    embeddings: 1, // Include embeddings field (the vector representation)
                    score: { $meta: 'vectorSearchScore' }, // Include similarity score
                },
            },
        ];
        // Execute the aggregation pipeline to fetch the embeddings and scores
        const results = yield collection.aggregate(pipeline).toArray();
        console.log('Results:', results);
        return results;
    });
}
