/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
require("ts-node/register");
const pg = require("pg");

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV !== "development") {
  pg.defaults.ssl = {
    rejectUnauthorized: false,
  };
}

module.exports = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
    },
  },

  staging: {
    client: "pg",
    connection: {
      connectionString: process.env.DB_MIGRATION_URL,
      ssl: NODE_ENV !== "development" && {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      extension: "ts",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DB_MIGRATION_URL,
      ssl: NODE_ENV !== "development" && {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      extension: "ts",
    },
  },
};
