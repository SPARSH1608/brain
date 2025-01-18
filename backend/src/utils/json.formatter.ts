import config from '../config/server.config';
import { parseApiResponse } from './Info.parser';

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(config.API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

async function runFromText(inputText: string) {
  const parts = [
    {
      text: 'input: Codeforces is a competitive programming website offering a platform for programmers to solve algorithmic problems.',
    },
    {
      text: 'output: {\n  "title": "Codeforces - Competitive Programming Website",\n  "description": "Codeforces is a website that offers competitive programming challenges, enabling developers to hone their algorithm and data structure skills.",\n  "summary": "Codeforces provides a platform for programmers to compete in algorithmic problem-solving and enhance their coding skills. It serves as a global hub for competitive programming enthusiasts."\n}',
    },
    {
      text: 'input: PostgreSQL is an open-source, object-relational database system known for its robustness and extensibility.',
    },
    {
      text: 'output: {\n  "title": "PostgreSQL - Open-Source Database System",\n  "description": "PostgreSQL is a powerful and extensible open-source object-relational database system trusted for its reliability and data integrity.",\n  "summary": "PostgreSQL is a leading database system that offers advanced features, reliability, and flexibility. It supports diverse workloads and is widely used in both small and large organizations."\n}',
    },
    { text: `input: ${inputText}` },
    { text: 'output: ' },
  ];

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
    generationConfig,
  });

  const response = result.response.text();
  console.log('response', response);
  const formattedText = parseApiResponse(response);
  console.log('formattedText', formattedText);
  return formattedText;
}

export async function generateContentFromText(inputText: string) {
  const res = runFromText(inputText);
  return res;
}
