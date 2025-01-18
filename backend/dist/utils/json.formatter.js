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
exports.generateContentFromText = generateContentFromText;
const server_config_1 = __importDefault(require("../config/server.config"));
const Info_parser_1 = require("./Info.parser");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } = require('@google/generative-ai');
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(server_config_1.default.API_KEY);
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
function runFromText(inputText) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const result = yield model.generateContent({
            contents: [{ role: 'user', parts }],
            generationConfig,
        });
        const response = result.response.text();
        console.log('response', response);
        const formattedText = (0, Info_parser_1.parseApiResponse)(response);
        console.log('formattedText', formattedText);
        return formattedText;
    });
}
function generateContentFromText(inputText) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = runFromText(inputText);
        return res;
    });
}
