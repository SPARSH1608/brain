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
const express_1 = __importDefault(require("express"));
const server_config_1 = __importDefault(require("./config/server.config"));
const db_1 = require("./config/db");
const index_1 = __importDefault(require("./routes/index"));
const cors_1 = __importDefault(require("cors"));
const uploadthing_1 = require("./uploadthing");
const server_1 = require("uploadthing/server");
const app = (0, express_1.default)();
// app.use(
//   cors({
//     credentials: true,
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders:
//       'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
//   })
// );
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Configure Uploadthing
const f = (0, server_1.createUploadthing)();
const uploadthingConfig = {
    config: {
        uploadMiddleware: uploadthing_1.uploadRouter,
        callbackUrl: '/api/uploadthing',
        // Add any other required configuration options
    },
};
app.use('/api/v1', index_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    app.listen(server_config_1.default.PORT, () => {
        console.log(`Server listening on port ${server_config_1.default.PORT}`);
    });
    (0, db_1.connectDB)(server_config_1.default.MONGO_URI);
});
startServer();
