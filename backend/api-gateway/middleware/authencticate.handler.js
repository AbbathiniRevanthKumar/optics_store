const { redisClient } = require("../config/redis.config");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/errorHandler");
const {
  verifyToken,
  generateServiceToken,
} = require("../utils/jwt");

exports.authenticate = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken || null;
  if (!accessToken) throw new ApiError("Please login", 401);

  try {
    const decoded = verifyToken(accessToken);
    const isblackListToken = await redisClient.get(`bl_${accessToken}`);
    if (isblackListToken) throw new Error("Token blacklisted");
    const { iat, exp, ...user } = decoded;

    const serviceToken = generateServiceToken(user);    
    req.headers["x-service-token"] = serviceToken;
    next();
  } catch (error) {
    throw new ApiError("Invalid token", 401);
  }
});
