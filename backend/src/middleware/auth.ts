import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization');
  
  if (!token) {
    res.status(401).json({ message: 'Access Denied' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'your-secret-key';

  try {
    const decoded = jwt.verify(token.split(' ')[1], secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid Token' });
  }
};

export default authenticateJWT;
