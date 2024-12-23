import { Content } from '../models/content.model';
import { Embedding } from '../models/embedding.model';
import { NextFunction, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { displayVideoInfo, extractVideoId } from '../utils/get.yt.content';
import { generateContent } from '../utils/generate.content';
import { detectContentType } from '../utils/detect.content';
import { generateTags } from '../utils/generate.tags';
import { generateVoyageAIEmbeddings } from '../utils/generate.embeddings';
import { upload } from '../utils/upload.file';
import { generateResponse } from '../utils/generate.response';
import { vectorSearch } from '../utils/vector-search';
import config from '../config/server.config';

export const createContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Create Content:', req.body);
  console.log('user', req.userId);
  const contentInput = req.body;
  const contentType = detectContentType(contentInput.input);
  console.log('contentType', contentType);
  let linkContent;
  let fileUrl;
  if (
    contentType === 'image' ||
    contentType === 'video' ||
    (contentType === 'audio' && contentInput.file)
  ) {
    console.log('Uploading file...');
    fileUrl = await upload(contentInput.file); // Upload the file using the utility function
    console.log('File uploaded. File URL:', fileUrl);

    // Use the file URL to generate content
    linkContent = await generateContent(fileUrl);
  } else if (contentType === 'link' && contentInput.input.includes('youtu')) {
    const videoId = extractVideoId(contentInput.input);
    console.log('YouTube Video ID:', videoId);
    if (videoId) {
      // Fetch video info using YouTube API
      linkContent = await displayVideoInfo(contentInput.input);
      console.log('YouTube Video Info:', linkContent);
    }
  } else {
    // Otherwise, handle other types of links (image, video, audio, webpage)
    linkContent = await generateContent(contentInput.input);
    console.log('Link Content:', linkContent);
  }
  try {
    // Generate tags based on the content input
    const tags = await generateTags(linkContent);
    console.log('Generated Tags:', tags);

    // If generateTags returns a single string, split it into an array
    const tagsArray = tags.split(',').map((tag: string) => tag.trim());

    // Save the content in the database based on detected type
    const content = new Content({
      userId: req.userId,
      type: contentType,
      text: contentType === 'text' ? contentInput.input : '', // Only if type is text
      link: contentType === 'link' ? contentInput.input : '', // Only if type is a link
      fileUrl:
        contentType === 'image' ||
        contentType === 'video' ||
        contentType === 'audio'
          ? contentInput.input
          : '', // Only for media files
      tags: tagsArray, // Save the tags array
    });
    const savedContent = await content.save();
    console.log('Content Saved', savedContent);

    const embeddings = await generateVoyageAIEmbeddings(contentInput.input);
    if (embeddings) {
      // Step 3: Save the embeddings in the Embedding collection
      const embedding = new Embedding({
        contentId: savedContent._id,
        embeddings: JSON.stringify(embeddings),
      });
      await embedding.save();

      res.status(200).json({
        success: true,
        message: 'Content and embeddings saved successfully!',
      });
      return;
    } else {
      console.log('Error generating embeddings');
    }
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
    return;
  }
};

export const getContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    console.log('userId', userId);
    const content = await Content.find({ userId: userId });
    res.status(200).json({ success: true, data: content });
    return;
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
    return;
  }
};

export const deleteContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contentId = req.body.contentId;
    console.log('contentId', contentId);
    const userId = req.userId;
    console.log('userId', userId);
    const content = await Content.findOne({ _id: contentId, userId: userId });
    if (!content) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this content',
      });
      return;
    }
    await Content.deleteOne({ _id: contentId, userId: userId });
    res
      .status(200)
      .json({ success: true, message: 'Content deleted successfully' });
    return;
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
    return;
  }
};

export const searchContent = async (req: Request, res: Response) => {
  const { query, tag } = req.body;
  const userId = req.userId;
  console.log('userId', userId);
  try {
    if (tag) {
      const contentByTag = await Content.find({ tags: { $in: [tag] } });
      res.json({ results: contentByTag });
      return;
    }

    if (query) {
      console.log('Performing vector search...');
      const client = await new MongoClient(config.MONGO_URI);
      const db = client.db(config.DB_NAME);
      const collection = db.collection(config.COLLECTION_NAME);
      const indexes = await collection.indexes();
      console.log('Indexes:', indexes);
      const searchResults = await vectorSearch(query, collection);
      console.log('Search Results:', searchResults);
      const contextEmbeddings = searchResults.map(
        (result) => result.embeddings
      );
      console.log('Context embeddings retrieved:', contextEmbeddings);

      console.log('Generating final response...');
      const finalResponse = await generateResponse({
        context: contextEmbeddings,
        query,
      });

      console.log('Final Response:', finalResponse);

      res.status(200).json({
        message: 'Search results',
        success: true,
        geminiResponse: finalResponse,
      });
      return;
    }

    res
      .status(400)
      .json({ success: false, message: 'Invalid search parameters' });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
