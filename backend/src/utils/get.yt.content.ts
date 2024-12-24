import config from '../config/server.config';

interface Info {
  title: string;
  description: string;
  summary?: string;
}

// Function to extract the video ID from a YouTube URL
export function extractVideoId(url: string) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Function to fetch video information (title and description) from YouTube API
async function fetchVideoInfo(videoId: string): Promise<Info | null> {
  const apiKey = 'AIzaSyAG5SMLptqXXQdVBzbeFaOpYsRqzX4DDNc'; // Replace with your YouTube API key
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const video = data.items[0].snippet;
      return {
        title: video.title,
        description: video.description,
      };
    } else {
      throw new Error('No video found');
    }
  } catch (error) {
    console.error('Error fetching video data:', error);
    // alert('Error fetching video information.');
    return null;
  }
}

// Function to get video details and display them
export async function displayVideoInfo(url: string) {
  const videoId = extractVideoId(url);
  if (videoId) {
    const videoInfo = await fetchVideoInfo(videoId);
    if (videoInfo) {
      console.log('Title:', videoInfo.title);
      console.log('Description:', videoInfo.description);
    }
    return videoInfo;
  } else {
    console.log('Invalid YouTube URL!');
  }
}
