import { Content } from '../models/content.model';
import { Embedding } from '../models/embedding.model';
import { NextFunction, Request, Response } from 'express';

import { displayVideoInfo, extractVideoId } from '../utils/get.yt.content';
import { generateContent } from '../utils/generate.content';
import { detectContentType } from '../utils/detect.content';
import { generateTags } from '../utils/generate.tags';
import { generateEmbeddings } from '../utils/generate.embeddings';
import { User } from '../models/user.model';
// Initialize the Generative AI instance with your API key

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
  if (contentType === 'link' && contentInput.input.includes('youtu')) {
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

    const embeddings = await generateEmbeddings(contentInput.input);
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
