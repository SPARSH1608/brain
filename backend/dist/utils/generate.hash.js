"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
// const input = '100xdevs';
// const hash = crypto.createHash('sha256').update(input).digest('hex');
// console.log(hash);
const createHash = (input) => {
    const hash = crypto_1.default.createHash('sha256').update(input).digest('hex');
    return hash;
};
exports.createHash = createHash;
