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
  const results = await collection.aggregate(pipeline).toArray();
  console.log('Results:', results);
  return results;
}
