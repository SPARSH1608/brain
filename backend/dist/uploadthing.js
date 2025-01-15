"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const server_1 = require("uploadthing/server");
const f = (0, server_1.createUploadthing)();
exports.uploadRouter = {
    singleMediaUpload: f({
        image: { maxFileSize: '4MB', maxFileCount: 1 },
        video: { maxFileSize: '32MB', maxFileCount: 1 },
        audio: { maxFileSize: '8MB', maxFileCount: 1 },
    }).onUploadComplete((data) => {
        console.log('File URL:', data);
        return { url: data.file.url };
    }),
};
