const { consts } = require("./config");

const corsOptions = {
  origin: (origin, cb) => {   
    const allowedOrigins =  consts.allowed_origins.split(",") ||[];

    if (!origin || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error(`CORS ERROR! Invalid Origin : ${origin}`));
  },
  credentials: true,
};

module.exports = { corsOptions };
