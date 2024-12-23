import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/server.config';

// Define a custom type for the decoded token
interface DecodedToken extends JwtPayload {
  userId: string;
}

// Extend the Express Request interface to include userId
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as DecodedToken;

    console.log('d', decoded.id);
    req.userId = decoded.id;
    console.log('user entered', req.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};

export default authMiddleware;
