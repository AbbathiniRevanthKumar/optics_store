import { CorsOptions } from "cors";
import { ApiError } from "../utils/response.handler";

const corsConfig: CorsOptions = {
  origin: (origin, cb) => {
    const allowedOrigins: string[] =
      process.env.ALLOWED_ORIGINS?.split(",") || [];

    if (
      (process.env.APP_ENV === "DEV" && !origin) ||
      (origin && allowedOrigins.includes(origin))
    ) {
      cb(null, true);
    } else {
      cb(new ApiError(`CORS ERROR! Invalid Origin : ${origin}`,400));
    }
  },
  credentials: true,
};

export default corsConfig;
