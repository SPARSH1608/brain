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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractVideoId = extractVideoId;
exports.displayVideoInfo = displayVideoInfo;
// Function to extract the video ID from a YouTube URL
function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
// Function to fetch video information (title and description) from YouTube API
function fetchVideoInfo(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = 'AIzaSyAG5SMLptqXXQdVBzbeFaOpYsRqzX4DDNc'; // Replace with your YouTube API key
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
        try {
            const response = yield fetch(apiUrl);
            const data = yield response.json();
            if (data.items && data.items.length > 0) {
                const video = data.items[0].snippet;
                return {
                    title: video.title,
                    description: video.description,
                };
            }
            else {
                throw new Error('No video found');
            }
        }
        catch (error) {
            console.error('Error fetching video data:', error);
            // alert('Error fetching video information.');
            return null;
        }
    });
}
// Function to get video details and display them
function displayVideoInfo(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const videoId = extractVideoId(url);
        if (videoId) {
            const videoInfo = yield fetchVideoInfo(videoId);
            if (videoInfo) {
                console.log('Title:', videoInfo.title);
                console.log('Description:', videoInfo.description);
            }
            return videoInfo;
        }
        else {
            console.log('Invalid YouTube URL!');
        }
    });
}
