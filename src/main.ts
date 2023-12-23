import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import expressSession from 'express-session';
import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from './models/User.js';
import { initRouter } from './routes/index.js';
import connectDB from './utils/mongoose.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// passport sessions config
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET ?? 'session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {},
    name: process.env.SESSION_NAME ?? 'session_name',
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  }),
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, () => {}));

passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    return done(null, user);
  });
});

passport.deserializeUser(async function (id, done) {
  return await User.findOne({ id })
    .then((user) => done(null, user))
    .catch((error) => done(error));
});

const whiteList = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : [];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) =>
    !origin || whiteList.indexOf(origin) !== -1 ? callback(null, true) : callback(null, false),
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

initRouter(app);

app.set('port', process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000);

app.listen(app.get('port'), () => {
  connectDB().then(() =>
    logger.info('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env')),
  );
});
