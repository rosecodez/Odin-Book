require('dotenv').config();
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';
import prisma from './prisma/prisma';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import { Strategy as GoogleStrategy, Profile, VerifyCallback  } from 'passport-google-oauth20';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', 1);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

prisma
  .$connect()
  .then(() => console.log('Connected to database'))
  .catch(console.error);

// suppresses ts possibly undefined warning, and acknowledges expecting them to be set
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
});

app.use(
  cors({
    origin: 'https://odin-book-frontend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const prismaSessionStore = new PrismaSessionStore(prisma as any, {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  sessionModelName: 'Session',
});

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: prismaSessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      callbackURL: 'https://odin-book-d8do.onrender.com/auth/google/callback',
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    
    async function (req: express.Request, accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback) {
      try {
        const defaultProfileImage = 'https://res.cloudinary.com/dbmnceulk/image/upload/v1726786843/MessagingApp/xwhnyzgqeliffxa9lsrm.png';
        const googleProfileImage = profile._json.picture ?? defaultProfileImage;

        let user = await prisma.user.findFirst({
          where: { googleId: profile.id },
        });

        const cloudinaryResult = await cloudinary.uploader.upload(
          googleProfileImage,
          {
            use_filename: true,
            unique_filename: false,
          }
        );

        const profileImageUrl = cloudinaryResult.secure_url || defaultProfileImage;

        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile._json.name!,
              profile_image: profileImageUrl,
              googleId: profile.id,
            },
          });
        } else {
          if (
            user.profile_image !== profileImageUrl &&
            !user.profile_image.includes('res.cloudinary.com')
          ) {
            await prisma.user.update({
              where: { id: user.id },
              data: { profile_image: profileImageUrl },
            });
          }
        }

        req.session.accessToken = accessToken;
        return cb(null, user);
      } catch (err) {
        console.error(err);
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, (user as { id: number }).id);
});


passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return done(null, false);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  console.log('req session in app.js', req.session);

  if (req.user) {
    req.session.user = req.user;
    req.session.save((err) => {
      if (err) console.error('Error saving session:', err);
      else console.log('session saved');
    });
  }

  next();
});

app.get('/check-authentication', (req, res) => {
  console.log('checking authentication');
  console.log('session req', req.session);
  console.log('session id req:', req.sessionID);

  if (req.session && req.session.user) {
    console.log('user exists', req.session.user);
    return res.status(200).json({
      isAuthenticated: true,
      sessionId: req.sessionID,
      user: {
        username: req.session.user.username,
        isVisitor: req.session.user.isVisitor || false,
        googleId: req.session.user.googleId || false,
      },
    });
  }

  console.log('no user in session');
  return res.status(200).json({ isAuthenticated: false });
});

import authRouter from './routes/googleAuth';
import usersRouter from './routes/users';
import messagesRouter from './routes/messages';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';

app.use('/', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/messages', messagesRouter);
app.use('/comments', commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  }
});

module.exports = app;
