import { DataSource } from "typeorm";
import RxRequestEntity from "./Entity/RxRequestEntity";
import ApprovedDirection from "./Entity/ApprovedDirection";
import RxRequestLineItemEntity from "./Entity/RxRequestLineItemEntity";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "kannan",
  database: "postgres",
  synchronize: false,
  logging: true,
  entities: [RxRequestEntity,ApprovedDirection,RxRequestLineItemEntity],
  subscribers: [],
  migrations: [],
});
