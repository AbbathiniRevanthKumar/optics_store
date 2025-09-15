const asyncHandler = require("../../utils/asyncHandler");
const { consts } = require("../../config/config");
const { ApiError } = require("../../utils/errorHandler");
const { default: axios } = require("axios");
const { generateToken, generateRefreshToken } = require("../../utils/jwt/jwt");
const { setCookies } = require("../../utils/jwt/cookieHandler");

const REDIRECT_URI = `${consts.base_url}/oauth/google/callback`;
const AUTH_END_POINT = `https://accounts.google.com/o/oauth2/v2/auth`;
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";

exports.mainRoute = asyncHandler(async (req, res, next) => {
  res.send(`<a href='google/auth/google'>Login with Google</a>`);
});

exports.googleLoginPage = asyncHandler(async (req, res, next) => {
  const params = new URLSearchParams({
    client_id: consts.oauth_google_client_id,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });
  res.redirect(`${AUTH_END_POINT}?${params.toString()}`);
});

exports.goggleCallBack = asyncHandler(async (req, res, next) => {
  //get the code from callback
  const code = req.query.code;
  if (!code) throw new ApiError("No code provided from google!", 400);

  try {
    const params = new URLSearchParams({
      code,
      client_id: consts.oauth_google_client_id,
      client_secret: consts.oauth_google_client_secret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });
    const tokenApiConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const tokenRes = await axios.post(
      TOKEN_ENDPOINT,
      params.toString(),
      tokenApiConfig
    );

    //get the details from token api
    const { access_token, id_token, refresh_token } = tokenRes.data;

    //get the user information
    const profileApiConfig = {
      headers: { Authorization: `Bearer ${access_token}` },
    };
    const profileInformation = await axios.get(
      USERINFO_ENDPOINT,
      profileApiConfig
    );

    const profile = profileInformation.data;

    //get the jwt token
    const userAccessToken = generateToken(profile);
    const userRefreshToken = generateRefreshToken(profile);

    setCookies(userAccessToken, "accessToken",res);
    setCookies(userRefreshToken, "refreshToken",res);

    return res.status(200).json({
      success: true,
      message: "Logged In",
      token: userAccessToken,
      refreshToken: userRefreshToken,
      userDetails: profile,
    });
  } catch (error) {
    throw new ApiError(`Fetching profile error : ${error}`, 500);
  }
});
