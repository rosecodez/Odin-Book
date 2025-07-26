import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/prisma";
import bcrypt from "bcrypt"
import { body, validationResult } from 'express-validator';

exports.user_signup_post = [
  body('username', 'Username must be specified and valid').trim().escape(),
  body('password', 'Password must be specified and at least 10 characters long')
    .trim()
    .isLength({ min: 10 })
    .escape(),

  expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, visitor } = req.body;

    if (visitor) {
      req.session.user = { isVisitor: true };
      req.session.save();
      res.status(200).json({ user: req.session.user });
      return
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array(), user: req.body });
      return;
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        res.status(400).json({ message: 'Username already taken' });
        return
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      req.login(user, async (err) => {
        if (err) {
          console.error('Login error:', err);
          return next(err);
        }

        req.session.user = { id: user.id, username: user.username };
        req.session.save();

        res.status(200).json({
          message: 'Signup successful',
          user: { id: user.id, username: user.username },
        });
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      res
        .status(500)
        .json({ error: 'Internal Server Error', details: err.message });
    }
  }),
];

exports.user_login_post = [
  expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, visitor } = req.body;

    if (visitor) {
      req.session.user = { isVisitor: true };
      req.session.save();
      console.log('visitor session saved');
      res.status(200).json({ user: req.session.user });
      return
    }

    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        res.status(401).json({ message: 'Invalid username or password' })
        return
      }
        
      const isPasswordValid = await bcrypt.compare(password, user.password as string);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid username or password' });
        return
      }

      // this deletes any existing sessions
      await prisma.session.deleteMany({
        where: { data: { contains: `"user":${user.id}` } },
      });

      req.login(user, async (err) => {
        if (err) return next(err);

        req.session.user = {
          id: user.id,
          username: user.username,
          isVisitor: user.isVisitor || false,
        };

        req.session.save();
        console.log('session saved successfully');

        return res.status(200).json({ message: 'Login successful', user });
      });
    } catch (error) {
      console.error('Unexpected error', error);
      next(error);
    }
  }),
];

exports.user_logout_post = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://odin-book-frontend.onrender.com'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    if (!req.session) {
      res.status(400).json({ message: 'No session found' });
      return
    }
    
    const sessionId = req.sessionID;

    if (req.session.accessToken) {
      const revokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${req.session.accessToken}`;
      const revokeResponse = await fetch(revokeUrl, { method: 'POST' });

      if (revokeResponse.ok) {
        console.log('Google access token revoked successfully');
      } else {
        console.error(
          'Failed to revoke Google access token:',
          await revokeResponse.text()
        );
      }
    }

    req.logout((err) => {
      if (err) {
        console.error(err);
        return next(err);
      }

      req.session.destroy(async (err) => {
        if (err) {
          console.error(err);
          return next(err);
        }
        
        res.clearCookie('connect.sid', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });

        try {
          if (sessionId) {
            await prisma.session.deleteMany({ where: { sid: sessionId } });
            console.log('session deleted from prisma');
            res.status(200).json({ message: 'Logged out successfully' });
          }
        } catch (error) {
          console.error(error);
        }
        });
    });
  } catch (error: any) {
      console.error('Unexpected error during logout:', error);
      res.status(500).json({
        message: 'An unexpected error occurred during logout',
        details: error.message,
      });
    }
  }
);

exports.user_profile_get = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log(req.sessionID);
  console.log(req.session);
  console.log(req.session.user);
  console.log(req.user);

  const userId = req.session.user.id;
  if (!userId) {
    res.status(401).json({ message: 'user id doesnt exist' });
    return;
  }

  if (req.session.user.isVisitor) {
    res.status(200).json({
      user: { username: 'visitor', isVisitor: true },
    });
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        profile_image: true,
        bio: true,
        created_at: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return
    }

    res.json({ user: user });
  } catch (err) {
    return next(err);
  }
});

exports.user_update_profile_picture = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Request file object:', req.file);
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return
    }
    const userId = req.session.user.id;
    if (!userId) {
      res.status(401).json({ message: 'user id doesnt exist' });
      return;
    }

    // new cloudinary picture link
    const newProfileImage = req.file.path;
    console.log(newProfileImage);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profile_image: newProfileImage },
    });

    res.status(200).json({
      message: 'Image uploaded successfully!',
      profileImage: updatedUser.profile_image,
    });
  } catch (err) {
    console.error('Error updating profile picture', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

exports.user_get_all_contacts = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.session.user.id;
    if (!userId) {
      res.status(401).json({ message: 'user id doesnt exist' });
      return;
    }

    const contacts = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
    });

    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error getting contacts', err);
    res.status(500).json({ error: 'Failed to get contacts' });
  }
});

exports.user_update_bio_post = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.session.user.id;
    const { bio } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'user id doesnt exist' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bio: bio,
      },
    });

    res.status(200).json({ updatedUser });
  } catch (err) {
    console.error('Error updating bio', err);
    res.status(500).json({ error: 'Failed to update bio' });
  }
});

exports.user_get_by_username = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        post: true,
        followers: {
          include: { follower: true },
        },
        following: {
          include: { following: true },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return
    }

    const loggedInUserId = req.session.user.id;
    const isFollowing = user.followers.some(
      (follow) => follow.follower.id === loggedInUserId
    );

    res.json({
      id: user.id,
      username: user.username,
      profile_image: user.profile_image,
      bio: user.bio,
      isFollowing: !!loggedInUserId && isFollowing,
      post: user.post,
    });
  } catch (err) {
    next(err);
  }
});

exports.user_follow = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.session.user.id;
  const { username } = req.params;

  if (!userId) {
    res.status(401).json({ message: 'user id doesnt exist' });
    return;
  }

  try {
    const userToFollow = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!userToFollow) {
      res.status(404).json({ message: 'user not found' });
      return
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: userToFollow.id,
        },
      },
    });

    if (existingFollow) {
      // unfollow user
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: userToFollow.id,
          },
        },
      });
      res.json({ following: false });
    } else {
      // follow the user
      await prisma.follows.create({
        data: {
          followerId: userId,
          followingId: userToFollow.id,
        },
      });
      res.json({ following: true });
      return
    }
  } catch (error: any) {
    res.status(500).json({ message: 'error occured while following user' });
  }
});
