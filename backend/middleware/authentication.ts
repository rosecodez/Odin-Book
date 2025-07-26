import { Request, Response, NextFunction } from "express";

export default function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  console.log(req.session);
  console.log(req.user);
  console.log(req.session?.user);

  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://odin-book-frontend.onrender.com'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (!req.user && !req.session?.user) {
    console.log('unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = req.user || req.session.user;
  console.log(user);

  next();
}
