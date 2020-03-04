import { createConnection, Connection } from "typeorm";

import { DB, DB_HOST, DB_PORT, DB_PASSWORD, DB_USERNAME } from "config";

import { Article } from "./Article";
import { Rating } from "./Rating";

export let connection: Connection;
export default async function connectDB() {
  if (connection) return connection;

  connection = await createConnection({
    type: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB,
    entities: [Article, Rating],
    synchronize: true,
    logging: false
  });

  console.log("DB Connection has been established successfully.");

  return connection;
}
