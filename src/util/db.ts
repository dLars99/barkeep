import * as pg from 'pg';
import knex, {Knex} from "knex";

const NODE_ENV = process.env.NODE_ENV;
const DATABASE_URL = process.env.DATABASE_URL as string;

if (NODE_ENV !== 'development') {
  pg.defaults.ssl = {
    rejectUnauthorized: false,
  };
}

const config = {
  client: 'pg',
  connection: {
    connectionString: DATABASE_URL,
    ssl: NODE_ENV !== 'development' && {
      rejectUnauthorized: false,
    },
  },
  debug: NODE_ENV === 'development',
}

const db: Knex = knex(config as Knex.Config);
export default db;
