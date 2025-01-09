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
import { parseApiResponse } from '../utils/Info.parser';
import { mainGenerateTags } from '../utils/mainTag';
import { Tag } from '../models/tag.model';

interface Info {
  title: string;
  description: string;
  summary?: string;
}
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
  let linkContent: Info | null | undefined;
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
  if (linkContent === null) {
    res.status(400).json({
      message: 'Link content not found',
    });
    return;
  }
  try {
    // Generate tags based on the content input
    const tags = await generateTags(linkContent);
    console.log('Generated Tags:', tags);
    const mainTags = await mainGenerateTags(linkContent);
    const mainTagsArray = mainTags.split(',').map((tag: string) => tag.trim());

    const tagsArray = tags.split(',').map((tag: string) => tag.trim());
    console.log('mainTagsArray', mainTagsArray);
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
      info: linkContent,
    });
    const savedContent = await content.save();
    console.log('Content Saved', savedContent);
    const mainTagsDocument = new Tag({
      contentId: content._id,
      title: mainTagsArray,
    });
    await Content.updateOne(
      { _id: savedContent._id },
      { mainTagId: mainTagsDocument._id }
    );
    await mainTagsDocument.save();
    const embeddings = await generateVoyageAIEmbeddings(contentInput.input);
    if (embeddings) {
      // Step 3: Save the embeddings in the Embedding collection
      const embedding = new Embedding({
        contentId: savedContent._id,
        embeddings: embeddings,
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
    const content = await Content.find({ userId: userId })
      .populate('userId', 'username')
      .populate('mainTagId', 'title');

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
      //const searchResults: {
      //contentId: string;
      //embeddings: number[];
      //score: number;
      // }[]

      const contextEmbeddingsIds = searchResults.map(
        (result) => result.contentId
      );
      console.log('Context content ids retrieved:', contextEmbeddingsIds);
      let finalContext: Info[] = [];
      const contextContent = await Promise.all(
        contextEmbeddingsIds.map(async (id) => {
          const ans = await Content.findById(id);

          if (ans) {
            finalContext.push(ans.info);
          }
        })
      );
      console.log('Generating final response...', finalContext);
      const finalResponse = await generateResponse({
        context: finalContext,
        query,
      });
      console.log('f', finalResponse);

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
export const findContents = async (req: Request, res: Response) => {
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
      //const searchResults: {
      //contentId: string;
      //embeddings: number[];
      //score: number;
      // }[]

      const contextEmbeddingsIds = searchResults.map(
        (result) => result.contentId
      );
      console.log('Context content ids retrieved:', contextEmbeddingsIds);
      let finalContext: Info[] = [];
      const contextContent = await Promise.all(
        contextEmbeddingsIds.map(async (id) => {
          const ans = await Content.findById(id);

          if (ans) {
            finalContext.push(ans.info);
          }
        })
      );
      console.log('Generating final response...', finalContext);

      res.status(200).json({
        message: 'Search results',
        success: true,
        data: finalContext,
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
