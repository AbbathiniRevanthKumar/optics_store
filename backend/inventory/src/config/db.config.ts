import { Dialect, Sequelize } from "sequelize";
import appConfig from "./env.config";

appConfig();

const sequelize = new Sequelize(
  String(process.env.POSTGRES_DB),
  String(process.env.POSTGRES_USER_NAME),
  String(process.env.POSTGRES_PASSWORD),
  {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    dialect: process.env.POSTGRES_DIALECT as Dialect || "postgres",
    logging: process.env.APP_ENV === "DEV" ? console.log : false,
  }
);

export default sequelize;