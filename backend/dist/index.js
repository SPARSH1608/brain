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
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('uploads'));
// __dirname = path.resolve();
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: path.join(__dirname, 'tmp'),
//     createParentPath: true,
//     limits: {
//       fileSize: 10 * 1024 * 1024,
//     },
//   })
// );
app.use('/api/v1', index_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    app.listen(server_config_1.default.PORT, () => {
        console.log(`Server listening on port ${server_config_1.default.PORT}`);
    });
    (0, db_1.connectDB)(server_config_1.default.MONGO_URI);
});
startServer();
