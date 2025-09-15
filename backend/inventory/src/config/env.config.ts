import dotenv from "dotenv";

const appConfig = () => {
  if (process.env.NODE_ENV !== "PROD") {
    dotenv.config({ path: ".dev.env" });
  } else {
    dotenv.config({ path: ".prod.env" });
  }
};


export default appConfig;