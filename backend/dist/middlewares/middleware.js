"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_config_1 = __importDefault(require("../config/server.config"));
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, server_config_1.default.JWT_SECRET);
        console.log('d', decoded.id);
        req.userId = decoded.id;
        console.log('user entered', req.userId);
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
exports.default = authMiddleware;
