const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const bcrypt = require("bcrypt");
const prisma = require("./prisma/prisma.js");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oidc");
require("dotenv").config();
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const messagesRouter = require("./routes/messages.js");
const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

prisma
  .$connect()
  .then(() => console.log("Connected to database"))
  .catch(console.error);

const prismaSessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  sessionModel: "Session",
});

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: prismaSessionStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) return done(null, false, { message: "Incorrect username" });
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword)
        return done(null, false, { message: "Incorrect password" });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// google authentication passport strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },

    async function (issuer, profile, cb) {
      try {
        // find user in prisma by google id
        let user = await prisma.user.findFirst({
          where: { googleId: profile.id },
        });

        //if no user exists, create a new one
        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile.displayName,
              profile_image: profile.photos[0]?.value,
              googleId: profile.id,
            },
          });
        } else {
          if (user.profile_image !== profile.photos[0]?.value) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { profile_image: profile.photos[0]?.value },
            });
          }
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get("/check-authentication", (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        username: req.session.user.username,
        isVisitor: req.session.user.isVisitor || false,
      },
    });
  }
  return res.status(200).json({ isAuthenticated: false });
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/messages", messagesRouter);
app.use("/comments", commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
