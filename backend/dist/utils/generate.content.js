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
exports.generateContent = generateContent;
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
function run(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const parts = [
            { text: 'input: https://codeforces.com/' },
            {
                text: 'output: {\n  "title": "Codeforces",\n  "description": "Codeforces is a website that hosts competitive programming contests frequently.  It provides a platform for programmers to practice in different levels of various data structures and algorithms skills. ",\n  "summary": "Codeforces provides algorithmic problem sets for programmers of different learning strengths to test themselves in their knowledge base related to Computer Science. It is a global programming arena for competing and exchanging coding insights"\n}',
            },
            { text: 'input: https://github.com/hkirat/project-ideas-v2' },
            {
                text: 'output: {\n  "title": "hkirat/project-ideas-v2: A curated list of project ideas for software engineers.",\n  "description": "A curated list of project ideas for software engineers, categorized by area of interest and difficulty.  Includes ideas for web development, mobile development, machine learning, and more.",\n  "summary": "This GitHub repository offers a comprehensive collection of project ideas for software engineers at various skill levels.  The projects are categorized for easier navigation and cover a wide range of technologies and domains.  It\'s a valuable resource for those looking to build their portfolio or explore new areas of development."\n}',
            },
            {
                text: 'input: https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
            },
            {
                text: 'output: {\n  "title": "Strivers SDE Sheet | Top Coding Interview Problems - Take U Forward",\n  "description": "This article contains a curated list of top coding interview problems categorized by topic and difficulty level.  It\'s designed to help aspiring software engineers prepare for technical interviews.",\n  "summary": "The Strivers SDE Sheet is a popular resource for software engineering interview preparation.  It provides a structured collection of coding problems organized by topic and difficulty, making it easier to target specific areas for improvement.  The sheet covers a wide range of topics relevant to technical interviews."\n}',
            },
            { text: 'input: https://www.postgresql.org/' },
            {
                text: 'output: {\n  "title": "PostgreSQL: The world\'s most advanced open source database",\n  "description": "PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, data integrity, and correctness.",\n  "summary": "PostgreSQL is a leading open-source relational database known for its robustness and advanced features.  It\'s used globally by organizations of all sizes and offers a wide range of functionalities. The website provides comprehensive documentation, downloads, and community resources."\n}',
            },
            { text: `input:${url}` },
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
function generateContent(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = run(url);
        return res;
    });
}
