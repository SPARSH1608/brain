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
exports.login = exports.createUser = void 0;
const zod_1 = __importDefault(require("zod"));
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const server_config_1 = __importDefault(require("../config/server.config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = zod_1.default.object({
    username: zod_1.default.string().min(3).max(10),
    password: zod_1.default.string().min(8).max(20),
});
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        console.log(body);
        const { success } = userSchema.safeParse(body);
        if (!success) {
            res.status(411).json({ success: false, message: 'Error in Inputs' });
            return;
        }
        const user = yield user_model_1.User.find({
            username: req.body.username,
        });
        if (user && user._id) {
            res.status(403).json({
                success: false,
                message: 'User already exists with this username',
            });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(Number(server_config_1.default.SALT));
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
        const newUser = user_model_1.User.create({
            username: req.body.username,
            password: hashedPassword,
        });
        res
            .status(200)
            .json({ success: true, message: 'user successfully sign up' });
        return;
    }
    catch (error) {
        console.error('Error signing up', error);
        res.status(500).json({
            message: 'Internal server error',
        });
        return;
    }
});
exports.createUser = createUser;
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, server_config_1.default.JWT_SECRET);
};
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = userSchema.safeParse(req.body);
        if (!success) {
            res.status(411).json({ success: false, message: 'Error in Inputs' });
            return;
        }
        const user = yield user_model_1.User.findOne({
            username: req.body.username,
        });
        if (!user) {
            res.status(204).json({ success: false, message: 'User doesnt exist' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!isMatch) {
            res
                .status(403)
                .json({ success: false, message: 'Wrong username or password' });
            return;
        }
        const token = createToken(user._id);
        res
            .status(200)
            .json({ success: true, message: 'successfully login', token });
        return;
    }
    catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
        return;
    }
});
exports.login = login;
