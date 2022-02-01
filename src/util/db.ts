import * as pg from 'pg';
import knex, { Knex } from "knex";

const NODE_ENV = process.env.NODE_ENV;
const DATABASE_URL = process.env.DATABASE_URL;

if (NODE_ENV !== 'development') {
  pg.defaults.ssl = {
    rejectUnauthorized: false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const db: Knex = knex({
  client: 'pg',
  connection: DATABASE_URL,
  debug: NODE_ENV === 'development',
//   ssl: NODE_ENV !== 'development' && {
//     sslmode: 'require',
//     rejectUnauthorized: false,
//   },
});

export default knex;
