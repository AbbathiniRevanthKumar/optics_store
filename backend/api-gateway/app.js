const express = require("express");
const cors = require("cors");

const { corsOptions } = require("./config/corsConfig");
const proxyRoutes = require("./routes/proxy.routes");
const { routeNotFound, errorHandler } = require("./utils/errorHandler");
const redis = require("./config/redis.config");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());

redis.connectToRedis();

app.use(proxyRoutes);

app.use(routeNotFound);
app.use(errorHandler);

module.exports = app;
