import { generateVoyageAIEmbeddings } from './generate.embeddings';

export async function vectorSearch(
  query: string,
  collection: any
): Promise<{ contentId: string; embeddings: number[]; score: number }[]> {
  // Generate query embedding
  const queryEmbedding = await generateVoyageAIEmbeddings(query);
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
  const results = await collection.aggregate(pipeline).toArray();
  console.log('Results:', results);
  return results;
}
