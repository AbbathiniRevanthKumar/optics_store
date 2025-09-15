import { Response } from "express";

declare global {
  interface Error {
    statusCode?: number;
  }
}

//custom error
export class ApiError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
class ApiResponseHandler {
  static success<T>(
    res: Response,
    message: string,
    data: T | {} = {},
    status: number = 200
  ) {
    return res.status(status).json({
      success: true,
      message: message,
      data: data,
      errors: [],
    });
  }

  static error<T>(
    res: Response,
    message: string = "An error occured!",
    status: number = 500,
    error: any = []
  ) {
    return res.status(status).json({
      success: false,
      message,
      data: {},
      error,
    });
  }
}

export default ApiResponseHandler;
