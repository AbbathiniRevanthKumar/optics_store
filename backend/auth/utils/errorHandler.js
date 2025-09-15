const { consts } = require("../config/config");

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;  
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal server Error";
  consts.app_env === "DEV" && console.log("Error  : " , err);

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    stackTrace: consts.app_env === "DEV" ? err.stack : undefined,
  });
};

const notFound = (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

module.exports = { errorHandler, notFound ,ApiError};
