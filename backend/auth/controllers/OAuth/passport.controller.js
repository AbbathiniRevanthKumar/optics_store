const asyncHandler = require("../../utils/asyncHandler");
const { ApiError } = require("../../utils/errorHandler");
const { setCookies } = require("../../utils/jwt/cookieHandler");
const { generateToken, generateRefreshToken } = require("../../utils/jwt/jwt");

exports.userLogin = asyncHandler(async (req, res, next) => {
  const user = req.user["_json"] || {};
  if (!user) {
    throw new ApiError("Please Login again", 401);
  }
  const userAccessToken = generateToken(user);
  const userRefreshToken = generateRefreshToken(user);

  setCookies(userAccessToken, "accessToken", res);
  setCookies(userRefreshToken, "refreshToken", res);

  return res.status(200).json({
    success: true,
    message: "Logged In",
    token: userAccessToken,
    refreshToken: userRefreshToken,
    user: user,
  });
});
