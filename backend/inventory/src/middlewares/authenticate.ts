import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/response.handler";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["x-service-token"];

    if (!token || typeof token !== "string") {
      throw new ApiError("Service token header is missing", 403);
    }

    const secretKey = process.env.SERVICE_TOKEN_SECRET!;
    
    if (!secretKey) {
      throw new ApiError("Service token secret not configured", 500);
    }

    try {      
      const decodedDetails = jwt.verify(token, secretKey);
      req.user = decodedDetails;
    } catch (error) {
      console.log(error);
      throw new ApiError("Invalid Token", 401);
    }

    next();
  } catch (error: any) {
    throw new ApiError(error.message || "Invalid service token", 401);
  }
};

export default authenticate;
