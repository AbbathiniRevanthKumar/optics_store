const { redisClient } = require("../config/redis.config");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/errorHandler");
const { verifyToken } = require("../utils/jwt/jwt");

exports.authenticate = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken || null;
  if (!accessToken) throw new ApiError("Please login", 401);

  try {
    const decoded = verifyToken(accessToken);
    const isblackListToken = await redisClient.get(`bl_${accessToken}`);
    if (isblackListToken) throw new Error("Token blacklisted");
    req.user = decoded;
    req.token = accessToken;
    next();
  } catch (error) {
    throw new ApiError("Invalid token", 401);
  }
});
