import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import session from "express-session";
import prisma from "../prisma/prisma";

exports.comment_new_post = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req.session as any).user as { id: number };

    const { text } = req.body as { text: string };
    if (!text) {
      res.status(400).json({ message: 'Comment does not have a text' });
      return
    }

    const postId = parseInt(req.params.postId, 10);
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(404).json({ message: 'no post found' });
      return
    }

    const newComment = await prisma.comment.create({
      data: {
        content: text.trim(),
        userId: user.id,
        postId: postId,
      },
    });
    console.log(newComment);
    res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'New comment on post failed' });
    return
  }
});

exports.all_comments_get = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postId = parseInt(req.params.postId, 10);

    if (isNaN(postId)) {
      res.status(400).json({ message: "invalid post id" });
      return
    }

    const allComments = await prisma.comment.findMany({
      where: { postId: postId },
    });

    res.status(200).json(allComments);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: 'Error while retrieving comments for post' });
  }
});
