import { NextFunction, Request, Response } from "express";
import ApiResponseHandler from "./response.handler";

const errorHandler = (
  err: any ,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message: string = err.message || "An error occurred";
  const status: number = err.statusCode || err.status || 500;
  const appEnv: string = process.env.APP_ENV || "DEV";
  

  if (appEnv === "DEV") {
    console.error("Error:", err);
  }

  return ApiResponseHandler.error(
    res,
    message,
    status,
    appEnv === "DEV" ? [err.stack] : [message]
  );
};

const notFoundError = (req: Request, res: Response, next: NextFunction) => {
  const errorMsg = `${req.originalUrl} route not found`;
  return ApiResponseHandler.error(res, "No route found", 404, [errorMsg]);
};

export { errorHandler, notFoundError };
