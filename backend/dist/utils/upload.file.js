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
exports.upload = upload;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const server_config_1 = __importDefault(require("../config/server.config"));
// Function to upload files
function upload(file) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('upload', file);
        try {
            // Step 1: Get the upload URL from Uploadthing
            const uploadSessionResponse = yield axios_1.default.post('http://localhost:3000/api/uploadthing/fileUploader', {
                files: [file.type.split('/')[0]], // e.g., "image", "video", "audio"
            }, {
                headers: {
                    Authorization: `Bearer ${server_config_1.default.UPLOADTHING_TOKEN}`, // Pass the token in the Authorization header
                },
            });
            const { presignedUrl, fileKey } = uploadSessionResponse.data.files[0];
            // Step 2: Upload the file to the presigned URL
            const formData = new form_data_1.default();
            formData.append('file', file);
            yield axios_1.default.post(presignedUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Step 3: Construct and return the file URL
            const fileUrl = `https://uploadthing.com/file/${fileKey}`;
            return fileUrl;
        }
        catch (error) {
            console.error('Upload failed:', error);
            throw new Error('Failed to upload the file');
        }
    });
}
