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
import { uploadRouter } from '../uploadthing';
import { createUploadthing } from 'uploadthing/server';

interface Info {
  title: string;
  description: string;
  summary?: string;
}

// Create an endpoint handler
const uploadthingHandler = createUploadthing();

export const createContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;
    const isLink = req.body.isLink === 'true';
    const input = req.body.input;
    console.log(file, input, isLink);
    let fileUrl;
    let linkContent: Info | null | undefined;

    if (!isLink && file) {
      // Handle file upload
      const fileData = {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      };

      const response = uploadRouter.singleMediaUpload.onUploadComplete({
        input: fileData,
      });

      fileUrl = response.url;
      linkContent = await generateContent(fileUrl);
    } else if (isLink) {
      // Handle link content
      if (input.includes('youtu')) {
        linkContent = await displayVideoInfo(input);
      } else {
        linkContent = await generateContent(input);
      }
    }

    // if (linkContent === null) {
    //   res.status(400).json({
    //     message: 'Link content not found',
    //   });
    //   return;
    // }

    // Generate tags based on the content input
    console.log('linkcontet', linkContent);
    const tags = await generateTags(linkContent);
    console.log('Generated Tags:', tags);
    const mainTags = await mainGenerateTags(linkContent);
    const mainTagsArray = mainTags.split(',').map((tag: string) => tag.trim());

    const tagsArray = tags.split(',').map((tag: string) => tag.trim());
    console.log('mainTagsArray', mainTagsArray);
    // Save the content in the database based on detected type
    const content = new Content({
      userId: req.userId,
      type: detectContentType(linkContent),
      text: detectContentType(linkContent) === 'text' ? input : '', // Only if type is text
      link: detectContentType(linkContent) === 'link' ? input : '', // Only if type is a link
      fileUrl:
        detectContentType(linkContent) === 'image' ||
        detectContentType(linkContent) === 'video' ||
        detectContentType(linkContent) === 'audio'
          ? input
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
    const embeddings = await generateVoyageAIEmbeddings(input);
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
    console.error('Error:', error);
    res.status(500).json({ message: 'Content creation failed' });
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
