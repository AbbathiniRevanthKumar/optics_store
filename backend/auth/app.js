const express = require("express");
const cors = require("cors");

const db = require("./models/index");
const redis = require("./config/redis.config");
const { errorHandler, notFound } = require("./utils/errorHandler");
const { corsOptions } = require("./config/corsConfig");
const authRoutes = require("./routes/auth/auth.routes");
const oauthRoutes = require("./routes/OAuth/oauth.routes");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const expressSession = require("express-session");
const { consts } = require("./config/config");

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({secret : consts.sessionSecret,resave:true,saveUninitialized:false}));

//for oauth
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/oauth",oauthRoutes);
app.use(notFound);

app.use(errorHandler);

db.connect();
redis.connectToRedis();

module.exports = app;
