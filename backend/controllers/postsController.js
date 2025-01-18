const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const prisma = require("../prisma/prisma");

exports.post_new_post = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user;
    const { text } = req.body;

    if (!text && !req.file) {
      return res.status(400).json({ message: "Missing text or image" });
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

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating new post:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating a new post." });
  }
});

exports.posts_all_get = asyncHandler(async (req, res, next) => {
  const user = req.user;
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          not: user.id,
        },
      },
      orderBy: [
        {
          created_at: "desc",
        },
      ],
      include: {
        user: true,
        comment: true,
        like: true,
      },
    });
    return res.status(201).json(posts);
  } catch (error) {
    console.error("An error occurred while fetching posts", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching posts" });
  }
});

exports.posts_all_get_visitor = asyncHandler(async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: [
        {
          created_at: "desc",
        },
      ],
      include: {
        user: true,
        comment: true,
        like: true,
      },
    });
    return res.status(201).json(posts);
  } catch (error) {
    console.error("An error occurred while fetching posts", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching posts" });
  }
});

exports.posts_user_by_id = asyncHandler(async (req, res) => {
  const { userId } = req.params;
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
      return res.status(404).json({ message: "posts not found" });
    }

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to fetch posts" });
  }
});

exports.posts_user_all_get = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "userId params not found" });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          created_at: "desc",
        },
      ],
      include: {
        user: true,
        comment: true,
        like: true,
      },
    });
    return res.status(201).json(posts);
  } catch (error) {
    console.error("An error occurred while fetching posts", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching posts" });
  }
});

exports.get_post_by_id = asyncHandler(async (req, res, next) => {
  const postId = parseInt(req.params.postId, 10);

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        like: true,
        comment: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

exports.delete_post = asyncHandler(async (req, res, next) => {
  const postId = parseInt(req.params.postId, 10);

  try {
    const post = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

exports.update_post = asyncHandler(async (req, res, next) => {
  const postId = parseInt(req.params.postId, 10);
  const { content } = req.body;

  try {
    if (!content) {
      return res.status(400).json({ error });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content },
    });

    res.status(200).json({ message: "success on updating post", updatedPost });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

exports.like_post = asyncHandler(async (req, res, next) => {
  const postId = parseInt(req.params.postId, 10);
  const userId = req.user.id;

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });
    if (existingLike) {
      return res.status(400).json({ message: "post already liked" });
    }

    const likedPost = await prisma.like.create({
      data: {
        userId: userId,
        postId,
      },
    });

    res.sendStatus(200).json(likedPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

exports.unlike_post = asyncHandler(async (req, res, next) => {
  const postId = parseInt(req.params.postId, 10);
  const userId = req.user.id;

  try {
    const like = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (!like) {
      return res.status(404).json({ message: "like not found" });
    }

    await prisma.like.delete({
      where: {
        id: like.id,
      },
    });

    res.sendStatus(200).json({ message: "like deleted" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
