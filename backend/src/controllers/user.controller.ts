import zod from 'zod';
import { User } from '../models/user.model';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import config from '../config/server.config';
import jwt from 'jsonwebtoken';

const userSchema = zod.object({
  username: zod.string().min(3),
  password: zod.string().min(4),
});

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;
    console.log(body);
    const { success } = userSchema.safeParse(body);
    if (!success) {
      res.status(411).json({ success: false, message: 'Error in Inputs' });

      return;
    }
    const user: any = await User.find({
      username: req.body.username,
    });
    // console.log(user, user[0]._id);
    console.log(user);
    if (user.length > 0) {
      res.status(403).json({
        success: false,
        message: 'User already exists with this username',
      });
      return;
    }
    const salt = await bcrypt.genSalt(Number(config.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    res
      .status(200)
      .json({ success: true, message: 'user successfully sign up' });
    return;
  } catch (error) {
    console.error('Error signing up', error);
    res.status(500).json({
      message: 'Internal server error',
    });
    return;
  }
};
const createToken = (id: String) => {
  return jwt.sign({ id }, config.JWT_SECRET!);
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { success } = userSchema.safeParse(req.body);
    if (!success) {
      res.status(411).json({ success: false, message: 'Error in Inputs' });
      return;
    }

    const user: any = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      res.status(404).json({ success: false, message: 'User doesnt exist' });
      return;
    }
    console.log(user);
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      res
        .status(403)
        .json({ success: false, message: 'Wrong username or password' });
      return;
    }
    const token = createToken(user._id);
    res
      .status(200)
      .json({ success: true, message: 'successfully login', token });
    return;
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
    return;
  }
};
