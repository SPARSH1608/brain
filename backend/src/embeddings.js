const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('A');
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

async function run(input) {
  const result = await model.embedContent(input);
  console.log(result.embedding.values);
}
const userInput = `
    https://www.mongodb.com/docs/atlas/atlas-vector-search/create-embeddings/
`;

run(userInput);
