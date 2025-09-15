const { consts } = require("../../config/config");
const { ApiError } = require("../errorHandler");
const jwt = require("jsonwebtoken");

exports.setCookies = (token, tokenType, res = {}) => {
  if (!res) throw ApiError("Response is not defined");
  const expiryTime =
    tokenType === "accessToken"
      ? consts.cookie_expiry * 60 * 60 * 1000
      : consts.refresh_cookie_expiry * 24 * 60 * 60 * 1000;
  res.cookie(tokenType, token, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: expiryTime,
    secure: consts.app_env === "PROD",
  });

  return;
};

exports.clearCookies = (tokenType, res) => {
  res.clearCookie(tokenType, {
    httpOnly: true,
    sameSite: "Strict",
    secure: consts.app_env === "PROD",
  });
};
