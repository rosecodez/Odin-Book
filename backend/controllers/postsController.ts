import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/prisma";

exports.post_new_post = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('creating new post');
    const user = (req.session as any).user as { id: number };
    const { text } = req.body;

    if (!text && !req.file) {
     res.status(400).json({ message: 'Missing text or image' });
     return
    }

    console.log(req.file);

    const newPost = await prisma.post.create({
      data: {
        content: text,
        userId: user.id,
        post_image: req.file ? req.file.path : null,
      },
      include: {
        user: true,
      },
    });

    console.log(newPost);

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating new post:', error);
    res.status(500).json({ error: 'An error occurred while creating a new post.' });
  }
});

exports.posts_all_get = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('fetching all posts');
    const posts = await prisma.post.findMany({
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
      include: {
        user: true,
        comment: true,
        like: true,
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('An error occurred while fetching posts', error);
    res.status(500).json({ error: 'An error occurred while fetching posts' });
  }
});

exports.posts_all_get_visitor = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
      include: {
        user: true,
        comment: true,
        like: true,
      },
    });
    res.status(201).json(posts);
  } catch (error) {
    console.error('An error occurred while fetching posts', error);
    res.status(500).json({ error: 'An error occurred while fetching posts' });
  }
});

exports.posts_user_by_id = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;
  const parsedUserId = parseInt(userId, 10);

  if (isNaN(parsedUserId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  try {
    const posts = await prisma.post.findMany({
      where: { userId: parseInt(userId) },
      include: {
        user: true,
        comment: true,
        like: true,
      },
    });

    if (!posts.length) {
      res.status(404).json({ message: 'posts not found' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'failed to fetch posts' });
  }
});

exports.posts_user_all_get = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = (req.session as any).user as { id: number };
  const userId = user.id;

  if (!userId) {
    res.status(400).json({ message: 'userId params not found' });
    return
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
      include: {
        user: true,
        comment: true,
        like: true,
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('An error occurred while fetching posts', error);
    res.status(500).json({ error: 'An error occurred while fetching the posts' });
  }
});

exports.get_post_by_id = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const postId = parseInt(req.params.postId, 10);
  if (isNaN(postId)) {
      res.status(400).json({ message: 'Invalid post ID' });
      return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        like: {
          include: {
            user: true,
          },
        },
        comment: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching the post' });
  }
});

exports.delete_post = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const postId = parseInt(req.params.postId, 10);
  if (isNaN(postId)) {
    res.status(400).json({ message: 'Invalid post ID' });
    return;
  }

  try {
    const post = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching the post' });
  }
});

exports.update_post = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const postId = parseInt(req.params.postId, 10);
  const { content } = req.body;

  try {
    if (!content) {
      res.status(400).json({message: 'Post content is required'});
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content },
    });

    res.status(200).json({ message: 'success on updating post', updatedPost });
  } catch (err) {
    console.error('error updating post', err);
    res.status(500).json({ error: 'an error occurred while updating the post' });
  }
});

exports.like_post = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const postId = parseInt(req.params.postId, 10);
  const user = (req.session as any).user as { id: number };
  const userId = user.id;

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });
    if (existingLike) {
      res.status(400).json({ message: 'post already liked' });
      return
    }

    const likedPost = await prisma.like.create({
      data: {
        userId: userId,
        postId,
      },
    });

    res.status(200).json(likedPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

exports.unlike_post = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const postId = parseInt(req.params.postId, 10);
  const user = (req.session as any).user as { id: number };
  const userId = user.id;

  try {
    const like = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (!like) {
      res.status(404).json({ message: 'like not found' });
      return
    }

    await prisma.like.delete({
      where: {
        id: like.id,
      },
    });

    res.status(200).json({ message: 'like deleted' });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
