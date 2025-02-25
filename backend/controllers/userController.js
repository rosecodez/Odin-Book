const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const session = require('express-session');
const prisma = require('../prisma/prisma');

exports.user_signup_post = [
  body('username', 'Username must be specified and valid').trim().escape(),
  body('password', 'Password must be specified and at least 10 characters long')
    .trim()
    .isLength({ min: 10 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const { username, password, visitor } = req.body;

    if (visitor) {
      req.session.user = { isVisitor: true };
      await req.session.save();
      return res.status(200).json({ user: req.session.user });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), user: req.body });
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
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
        await req.session.save();

        res.status(200).json({
          message: 'Signup successful',
          user: { id: user.id, username: user.username },
        });
      });
    } catch (err) {
      console.error('Signup error:', err);
      res
        .status(500)
        .json({ error: 'Internal Server Error', details: err.message });
    }
  }),
];

exports.user_login_post = [
  asyncHandler(async (req, res, next) => {
    const { username, password, visitor } = req.body;

    if (visitor) {
      req.session.user = { isVisitor: true };
      await req.session.save();
      console.log('visitor session saved');
      return res.status(200).json({ user: req.session.user });
    }

    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user)
        return res
          .status(401)
          .json({ message: 'Invalid username or password' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: 'Invalid username or password' });
      }

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

        await req.session.save();
        console.log('session saved successfully');

        return res.status(200).json({ message: 'Login successful', user });
      });
    } catch (error) {
      console.error('Unexpected error', error);
      next(error);
    }
  }),
];

exports.user_logout_post = asyncHandler(async (req, res, next) => {
  try {
    if (req.session.accessToken) {
      const revokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${req.session.accessToken}`;
      const revokeResponse = await fetch(revokeUrl, { method: 'POST' });

      if (revokeResponse.ok) {
        console.log('google access token revoked successfully');
      } else {
        console.error(
          'failed to revoke google access token:',
          await revokeResponse.text()
        );
      }
    }

    if (!req.session) {
      return res.status(400).json({ message: 'no session found' });
    }

    console.log(req.session.user);

    const sessionId = req.sessionID;

    req.logout((err) => {
      if (err) {
        console.error(err);
        return next(err);
      }

      req.session.destroy(async (err) => {
        if (err) {
          console.error('error destroying session:', err);
          return res.status(500).json({ message: 'error destroying session' });
        }

        try {
          if (sessionId) {
            await prisma.session.deleteMany({ where: { sid: sessionId } });
            console.log('session deleted from prisma');
          }
        } catch (error) {
          console.error(error);
        }

        res.clearCookie('connect.sid', {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        });

        console.log('session successfully destroyed');
        return res.status(200).json({ message: 'logged out successfully' });
      });
    });
  } catch (error) {
    console.error('unexpected error during logout:', error);
    return res.status(500).json({
      message: 'an unexpected error occurred during logout',
    });
  }
});

exports.user_profile_get = asyncHandler(async (req, res, next) => {
  console.log(req.sessionID);
  console.log(req.session);
  console.log(req.session.user);
  console.log(req.user);

  if (req.session?.user?.isVisitor) {
    return res.status(200).json({
      user: { username: 'visitor', isVisitor: true },
    });
  }

  if (!req.user && !req.session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        profile_image: true,
        bio: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user });
  } catch (err) {
    return next(err);
  }
});

exports.user_update_profile_picture = asyncHandler(async (req, res, next) => {
  try {
    console.log('Request file object:', req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // new cloudinary picture link
    const newProfileImage = req.file.path;
    console.log(newProfileImage);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { profile_image: newProfileImage },
    });

    return res.status(200).json({
      message: 'Image uploaded successfully!',
      profileImage: updatedUser.profile_image,
    });
  } catch (err) {
    console.error('Error updating profile picture', err);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
});

// get all contacts
exports.user_get_all_contacts = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    // get all contacts that are not the logged user, for displaying as possible contacts
    const contacts = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
    });

    return res.status(200).json(contacts);
  } catch (err) {
    console.error('Error getting contacts', err);
    return res.status(500).json({ error: 'Failed to get contacts' });
  }
});

exports.user_update_bio_post = asyncHandler(async (req, res, next) => {
  try {
    const user = req.session.user;
    const bio = req.body;

    const userId = user.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bio: bio,
      },
    });

    return res.status(200).json({ updatedUser });
  } catch (err) {
    console.error('Error updating bio', err);
    return res.status(500).json({ error: 'Failed to update bio' });
  }
});

exports.user_get_by_username = asyncHandler(async (req, res, next) => {
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
      return res.status(404).json({ message: 'User not found' });
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

exports.user_follow = asyncHandler(async (req, res, next) => {
  const userId = req.session.user.id;
  const { username } = req.params;

  try {
    const userToFollow = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!userToFollow) {
      return res.status(404).json({ message: 'user not found' });
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
      return res.json({ following: false });
    } else {
      // follow the user
      await prisma.follows.create({
        data: {
          followerId: userId,
          followingId: userToFollow.id,
        },
      });
      return res.json({ following: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'error occured while following user' });
  }
});
