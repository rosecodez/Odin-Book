const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const prisma = require('./prisma/prisma.js');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const https = require('https');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const cors = require('cors');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/googleAuth.js');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages.js');
const postsRouter = require('./routes/posts.js');
const commentsRouter = require('./routes/comments.js');
const app = express();

app.use(
  cors({
    origin: 'https://odin-book-frontend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

prisma
  .$connect()
  .then(() => console.log('Connected to database'))
  .catch(console.error);

const prismaSessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  sessionModel: 'Session',
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: prismaSessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'x/auth/google/callback',
      scope: ['profile', 'email'],
      passReqToCallback: true,
      prompt: 'select_account',
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      try {
        const defaultProfileImage =
          'https://res.cloudinary.com/dbmnceulk/image/upload/v1726786843/MessagingApp/xwhnyzgqeliffxa9lsrm.png';
        const googleProfileImage = profile.photos[0].value;

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

        const profileImageUrl =
          cloudinaryResult.secure_url || defaultProfileImage;

        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile.displayName,
              profile_image: cloudinaryResult || defaultProfileImage,
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
  console.log('serialize user' + user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    console.log('deserialize user' + user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  console.log('req session in app.js' + req.session);
  if (req.user) {
    req.session.user = req.user;
  }
  next();
});

app.get('/check-authentication', (req, res) => {
  console.log('for /check-authentication logs');
  console.log(req.session);

  if (req.session && req.session.user) {
    console.log('user exists');
    return res.status(200).json({
      isAuthenticated: true,
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
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
