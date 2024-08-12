import { DataSource } from "typeorm";
import RxRequestEntity from "./Entity/RxRequestEntity";
import ApprovedDirection from "./Entity/ApprovedDirection";
import RxRequestLineItemEntity from "./Entity/RxRequestLineItemEntity";
import dotenv from "dotenv";
import ApprovedSigs from "./Entity/ApprovedSigs";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "test"}` });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.APP_DB_HOST,
  port: 5432,
  username: process.env.POM_DB_USERNAME,
  password: process.env.APP_DB_PWD,
  database: process.env.APP_DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [RxRequestEntity,ApprovedDirection,RxRequestLineItemEntity, ApprovedSigs],
  subscribers: [],
  migrations: [],
});