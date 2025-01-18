import { Content } from '../models/content.model';
import { Embedding } from '../models/embedding.model';
import { NextFunction, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { displayVideoInfo, extractVideoId } from '../utils/get.yt.content';
import { generateContent } from '../utils/generate.content';
import { detectContentType } from '../utils/detect.content';
import { generateTags } from '../utils/generate.tags';
import { generateVoyageAIEmbeddings } from '../utils/generate.embeddings';

import { generateResponse } from '../utils/generate.response';
import { vectorSearch } from '../utils/vector-search';
import config from '../config/server.config';

import { mainGenerateTags } from '../utils/mainTag';
import { Tag } from '../models/tag.model';
import cloudinary from '../config/cloudinary';
import { generateImageContent } from '../utils/generate.content.media';
import { contentCount, IContentCount } from '../models/content.count.model';
import { processMedia } from '../utils/huggingFace.content';
import { generateContentFromText } from '../utils/json.formatter';

interface Info {
  title: string;
  description: string;
  summary?: string;
}
const UploadToCloudinary = async (file: any) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.log('error in uploadtoCloudinary', error);
    throw new Error('Error uploadiing to cloudinary');
  }
};
const fs = require('fs').promises;

async function getFileBuffer(file: any) {
  try {
    const filePath = file.path;
    const buffer = await fs.readFile(filePath);
    console.log('File Buffer:', buffer);
    return buffer;
  } catch (error) {
    console.error('Error reading the file:', error);
  }
}

export const createContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const file = req.file;
    const isLink = req.body.isLink;
    const input = req.body.input;
    let fileUrl;
    console.log(file, input, isLink);

    let linkContent: Info | null | undefined;
    const contentType = detectContentType(file || input);
    console.log('Content Type:', contentType);
    if (isLink === 'false' && file) {
      fileUrl = await UploadToCloudinary(file);
      console.log('fileUrl', fileUrl);
      const fileBuffer = await getFileBuffer(file);
      console.log('fileBuffer', fileBuffer);

      if (contentType === 'image') {
        // linkContent = await processMedia(file.path, 'image', fileBuffer);
        let data = await generateImageContent(file.path);
        console.log('data', data);
        linkContent = await generateContentFromText(data);
        // linkContent = await generateMediaMetadata(fileBuffer);
        // } else if (contentType === 'audio') {
        //   linkContent = await processMedia(file.path, 'audio');
        // } else if (contentType === 'video') {
        //   linkContent = await processMedia(file.path, 'video');
        // }
      }
      console.log('linkContent', linkContent);
    } else {
      // Handle link content
      if (input?.includes('youtu')) {
        linkContent = await displayVideoInfo(input);
      } else {
        linkContent = await generateContent(input);
      }
    }

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
      type: detectContentType(file || input),
      text: detectContentType(file || input) === 'text' ? input : '', // Only if type is text
      link: detectContentType(file || input) === 'link' ? input : '', // Only if type is a link
      fileUrl:
        detectContentType(file || input) === 'image' ||
        detectContentType(file || input) === 'video' ||
        detectContentType(file || input) === 'audio'
          ? fileUrl
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
    //@ts-ignore
    let userDoc: IContentCount = await contentCount.findOne({
      userId: savedContent.userId,
    });
    console.log('userDoc', userDoc);

    if (savedContent.type === 'link' && savedContent.link?.includes('youtu')) {
      userDoc?.youtube.push(savedContent._id);
      userDoc?.links.push(savedContent._id);
    } else if (
      savedContent.type === 'link' &&
      savedContent.link?.includes('x.com')
    ) {
      userDoc?.twitter.push(savedContent._id);
      userDoc?.links.push(savedContent._id);
    } else if (savedContent.type === 'image') {
      userDoc?.images.push(savedContent._id);
    } else {
      userDoc?.links.push(savedContent._id);
    }
    await userDoc.save();
    const embeddings = await generateVoyageAIEmbeddings(file || input);
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

    const { filter } = req.query;
    console.log('userId', userId);
    console.log('filter', filter);
    const contentIds = await contentCount.find({
      userId: userId,
    });
    //@ts-ignore
    console.log('contentIds', contentIds[0][filter]);
    let content;
    if (filter) {
      content = await Content.find({
        //@ts-ignore
        _id: { $in: contentIds[0][filter] },
      })
        .populate('userId', 'username')
        .populate('mainTagId', 'title');
    } else {
      content = await Content.find({ userId: userId })
        .populate('userId', 'username')
        .populate('mainTagId', 'title');
    }

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
    console.log('content', content);

    await contentCount.updateOne(
      { userId },
      {
        $pull: {
          youtube: contentId,
          links: contentId,
          twitter: contentId,
          images: contentId,
        },
      }
    );

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

export const getCount = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const count = await contentCount.find({
      userId: userId,
    });
    //@ts-ignore

    res.status(200).json({ success: true, data: count });
    return;
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
    return;
  }
};
