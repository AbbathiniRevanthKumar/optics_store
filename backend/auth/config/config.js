if (process.env.NODE_ENV !== "prod" || process.env.NODE_ENV !== "staging") {
  require("dotenv").config({ path: [".env.dev"], override: true });
}

const consts = {
  app_env: process.env.APP_ENV || "PROD",
  app_port: process.env.APP_PORT || 5001,
  pg_username: process.env.PG_USERNAME,
  pg_password: process.env.PG_PASSWORD,
  pg_db: process.env.PG_DATABASE,
  pg_host: process.env.PG_HOST,
  pg_port: process.env.PG_PORT,
  db_dialect: process.env.DB_DIALECT,
  allowed_origins: process.env.ALLOWED_ORIGINS,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  jwt_expiry: process.env.JWT_EXPIRY,
  jwt_refresh_expiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  cookie_expiry: Number(process.env.COOKIE_EXPIRY),
  refresh_cookie_expiry: Number(process.env.REFRESH_COOKIE_EXPIRY),
  oauth_google_client_id : process.env.CLIENT_ID,
  oauth_google_client_secret : process.env.CLIENT_SECRET,
  base_url : process.env.BASE_URL,
  sessionSecret : process.env.SESSION_SECRET
};

module.exports = { consts };
