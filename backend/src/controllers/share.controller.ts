import { NextFunction, Request, Response } from 'express';
import { Link } from '../models/Link.model';
import { createHash } from '../utils/generate.hash';
import { Content } from '../models/content.model';
import { User } from '../models/user.model';
export const createLink = async (req: Request, res: Response) => {
  try {
    const userId: string = req.userId || '';
    const { share } = req.body;
    if (share) {
      const existingLink = await Link.findOne({ userId: userId });
      if (existingLink) {
        res.status(200).json({
          success: true,
          message: `Link already exists`,
          data: existingLink.hash,
        });
        return;
      }
      const link = await Link.create({
        userId: userId,
        hash: createHash(userId),
      });
      res.status(200).json({
        success: true,
        message: `Link created successfully`,
        data: link.hash,
      });
      return;
    }
    await Link.deleteOne({ userId: userId });
    res
      .status(200)
      .json({ success: true, message: `Link removed successfully` });
    return;
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ success: false, message: 'Error creating link' });
    return;
  }
};

export const sharedLink = async (req: Request, res: Response) => {
  try {
    const { shareLink } = req.params;
    const link = await Link.findOne({ hash: shareLink }).populate('userId');
    if (!link) {
      res.status(404).json({ success: false, message: 'Link not found' });
      return;
    }
    const userId = link.userId;
    if (!userId) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    const content = await Content.find({ userId: userId });
    res.status(200).json({ success: true, data: content });
    return;
  } catch (error) {
    console.error('Error retrieving content by share link:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving content by share link',
    });
    return;
  }
};
