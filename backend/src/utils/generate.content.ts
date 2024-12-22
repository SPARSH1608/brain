import config from '../config/server.config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(config.API_KEY);
const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Generate content based on URL
export async function generateContent(url: string) {
  const prompt = `
    You are an advanced AI system specialized in analyzing URLs and extracting meaningful information. Depending on the type of URL provided (image, video, audio, or general webpage), your task is to return a suitable **title**, **description**, and **short summary** of the content. Follow these instructions carefully:

    1. **For General Webpages (HTML-based):**
       - Extract the **title** from the <title> tag or equivalent meta tags.
       - Retrieve the **meta description** if available or summarize the content briefly.
       - Provide a **short summary** of the main content (max 3 sentences) based on the text and visible content.

    2. **For Image URLs:**
       - **Title**: Generate a concise and descriptive title that represents the image's content.
       - **Description**: Provide a detailed description based on visible elements (e.g., people, animals, nature, objects).
       - **Summary**: Write a short context-aware summary of the image (up to 3 sentences).
       - If the image is inaccessible or metadata is unavailable, return:
       {
         "title": "Image Content Not Accessible",
         "description": "Unable to retrieve details about the image.",
         "summary": "No summary available for the provided image URL."
       }

    3. **For YouTube Video URLs:**
       - Extract the **video ID** from the URL.
       - Use the **YouTube Data API** to retrieve metadata (title, description).
       - Generate a **title** based on the video’s title.
       - Provide a **description** from the metadata.
       - Summarize the content (50-100 words) based on the video’s description or content.
       - If video metadata is inaccessible, return:
       {
         "title": "Video Information Not Accessible",
         "description": "Unable to retrieve metadata for the provided YouTube video URL.",
         "summary": "No summary available for the provided YouTube video URL."
       }

    4. **For Other Video URLs (non-YouTube):**
       - Similar to YouTube video URLs, extract metadata (title, description, summary) where available.
       - If metadata is inaccessible, respond with:
       {
         "title": "Video Content Not Accessible",
         "description": "Unable to retrieve details about the video.",
         "summary": "No summary available for the provided video URL."
       }

    5. **For Audio URLs:**
       - **Title**: Generate a title based on audio metadata or filename.
       - **Description**: Describe the audio content, including genre, mood, or purpose.
       - **Summary**: Briefly summarize the audio content (e.g., "A soothing piano track perfect for relaxation").
       - If audio metadata is unavailable or the URL is inaccessible, respond with:
       {
         "title": "Audio Content Not Accessible",
         "description": "Unable to retrieve details about the audio.",
         "summary": "No summary available for the provided audio URL."
       }

    6. **Error Handling:**
       - If the content is inaccessible or the URL is invalid, respond with:
       {
         "title": "Content Not Accessible",
         "description": "The provided URL could not be accessed or analyzed.",
         "summary": "No summary available for the given URL."
       }

    **URL**: ${url}
  `;

  try {
    // Generate content using the Gemini model
    const result = await model2.generateContent([prompt]);

    // Debugging: Log the raw response to inspect its structure
    console.log('Raw API response:', result);

    // Check if the text function is available and call it
    if (result?.response?.text && typeof result.response.text === 'function') {
      const text = await result.response.text(); // Invoke the function to get the text response
      return text;
    } else {
      return {
        title: 'Error',
        description: 'No valid content response from the model.',
        summary: 'Unable to generate content for the provided URL.',
      };
    }
  } catch (error) {
    console.error('Error generating content:', error);
    return {
      title: 'Error',
      description: 'An error occurred while generating content.',
      summary: 'The content generation failed due to an error.',
    };
  }
}
