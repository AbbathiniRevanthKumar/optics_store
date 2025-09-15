const jwt = require("jsonwebtoken");
const { consts } = require("../config/config");

const generateToken = (payload) => {
  return jwt.sign(payload, consts.jwt_secret_key, {
    expiresIn: consts.jwt_expiry,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, consts.jwt_refresh_secret, {
    expiresIn: consts.jwt_refresh_expiry,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, consts.jwt_secret_key);
};

const verifyRefreshToken = (refreshToken)=>{
  return jwt.verify(refreshToken,consts.jwt_refresh_secret);
}


const generateServiceToken = (payload) => {    
  return jwt.sign(payload, consts.jwt_service_secret_key, {
    expiresIn: consts.jwt_service_expiry,
  });
};

module.exports = { generateToken, verifyToken,generateRefreshToken,verifyRefreshToken,generateServiceToken };
