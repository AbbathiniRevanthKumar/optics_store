const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/errorHandler");
const userService = require("../services/user.service");
const bcrypt = require("bcrypt");
const {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt/jwt");
const { redisClient } = require("../config/redis.config");
const { setCookies, clearCookies } = require("../utils/jwt/cookieHandler");

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    throw new ApiError("Provide name,email,password and role of user", 400);
  }

  const userExsits = await userService.findByEmail(email);
  if (userExsits) throw new ApiError(`Email : '${email}' already exists`, 400);

  //user not exists
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userService.createUser({
    name,
    email,
    password: hashedPassword,
    role,
    auth_type: "auth",
  });

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  //generate token
  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  setCookies(token, "accessToken", res);
  setCookies(refreshToken, "refreshToken", res);

  await redisClient.set(`refresh_${payload.id}`, refreshToken);

  return res.status(201).json({
    success: true,
    message: "User registered",
    user: payload,
    token,
    refreshToken,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password)
    throw new ApiError("Please provide login details", 400);

  const user = await userService.findByEmail(email);

  if (!user) throw new ApiError("Invalid credentials", 403);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError("Invalid credentials", 403);

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  //generate token
  const token = generateToken(payload);

  const refreshToken = generateRefreshToken(payload);

  await redisClient.set(`refresh_${payload.id}`, refreshToken, {
    EX: 7 * 24 * 60 * 60,
  });

  setCookies(token, "accessToken", res);
  setCookies(refreshToken, "refreshToken", res);

  return res.status(200).json({
    success: true,
    message: "Logged In",
    user: payload,
    token,
    refreshToken,
  });
});

exports.refresh = asyncHandler(async (req, res, next) => {
  let refreshToken = req.cookies.refreshToken || null;

  if (!refreshToken) throw new ApiError("Missing refersh token", 401);

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const payload = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    const storedRefreshToken = await redisClient.get(`refresh_${payload.id}`);

    if (refreshToken !== storedRefreshToken) {
      throw new ApiError("Invalid token", 401);
    }
    const token = generateToken(payload);
    refreshToken = generateRefreshToken(payload);

    await redisClient.set(`refresh_${payload.id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    setCookies(token, "accessToken", res);
    setCookies(refreshToken, "refreshToken", res);

    return res.status(200).json({
      success: true,
      token,
      refreshToken,
    });
  } catch (error) {
    throw new ApiError("Invalid refresh token", 401);
  }
});

exports.logout = asyncHandler(async (req, res, next) => {
  const user = req.user || {};

  const expiresIn = user.exp - Math.floor(Date.now() / 1000);
  await redisClient.set(`bl_${req.token}`, "true", { EX: expiresIn });
  await redisClient.del(`refresh_${user.id}`);

  clearCookies("accessToken", res);
  clearCookies("refreshToken", res);

  return res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

exports.userDetails = asyncHandler(async (req, res, next) => {
  const user = req.user;
  return res.status(200).json({
    success: true,
    data: user,
  });
});
