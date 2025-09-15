import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/response.handler";

const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {      
      const user = (req as any).user || null;

      if (!user) {
        throw new ApiError("Unauthorized. No user found.", 401);
      }

      if (!allowedRoles.includes(user.role)) {
        throw new ApiError("Forbidden. You do not have access.", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorizeRole;
