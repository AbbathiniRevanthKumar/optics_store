const dotenv = require("dotenv");
const path = require("path");

const app_env = "DEV";
const envPath =
  app_env == "PROD" ? path.resolve(".env.prod") : path.resolve(".env.dev");

const env = dotenv.config({ path: envPath, override: true });

const consts = {
  app_env: app_env,
  app_port: env.parsed.GATEWAY_PORT || 8001,
  auth_service: env.parsed.AUTH_SERVICE,
  allowed_origins: env.parsed.allowed_origins,
  jwt_secret_key: env.parsed.JWT_SECRET_KEY,
  jwt_expiry: env.parsed.JWT_EXPIRY,
  jwt_refresh_expiry: env.parsed.JWT_REFRESH_TOKEN_EXPIRY,
  jwt_refresh_secret: env.parsed.JWT_REFRESH_TOKEN_SECRET,
  inventory_service: env.parsed.INVENTORY_SERVICE,
  jwt_service_secret_key : env.parsed.JWT_SERVICE_SECRET_KEY,
  jwt_service_expiry : env.parsed.JWT_SERVICE_EXPIRY
};

module.exports = { consts };
