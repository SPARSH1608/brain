"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = require("uploadthing/express");
const f = (0, express_1.createUploadthing)();
exports.uploadRouter = {
    mediaUploader: f({
        image: { maxFileSize: '4MB', maxFileCount: 1 },
        video: { maxFileSize: '32MB', maxFileCount: 1 },
        audio: { maxFileSize: '8MB', maxFileCount: 1 },
    }).onUploadComplete((data) => {
        console.log('Upload completed:', data);
    }),
};
