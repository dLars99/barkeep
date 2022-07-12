import * as pg from "pg";
import knex, { Knex } from "knex";

const NODE_ENV = process.env.NODE_ENV;
const DOCKER = process.env.DOCKER;
const DATABASE_URL = process.env.DATABASE_URL as string;

const isDocker = DOCKER === "true" ? true : false;

/* If running on a local docker instance, this is not needed */
if (NODE_ENV !== "development" && !isDocker) {
  pg.defaults.ssl = {
    rejectUnauthorized: false,
  };
}

const config = {
  client: "pg",
  connection: {
    connectionString: DATABASE_URL,
    ssl: NODE_ENV !== "development" &&
      !isDocker && {
        rejectUnauthorized: false,
      },
  },
  debug: NODE_ENV === "development",
};

const db: Knex = knex(config as Knex.Config);
export default db;
