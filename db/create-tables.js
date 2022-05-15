/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const pg = require("pg");

const { DATABASE_URL, NODE_ENV } = process.env;

if (NODE_ENV !== "development") {
  pg.defaults.ssl = {
    rejectUnauthorized: false,
  };
}

const db = require("knex")({
  client: "pg",
  connection: {
    connectionString: DATABASE_URL,
    ssl: NODE_ENV !== "development" && {
      rejectUnauthorized: false,
    },
  },
  debug: NODE_ENV === "development",
});

const createCategoriesTable = async () => {
  try {
    await db.schema.hasTable("categories").then((exists) => {
      if (!exists) {
        return db.schema.createTable("categories", (t) => {
          t.increments("id").primary();
          t.string("category_name", 100).unique().notNullable();
        });
      } else {
        console.log("Table categories not created. Table already exists.");
      }
    });
  } catch (err) {
    throw err;
  }
};

const createIngredientTypesTable = async () => {
  try {
    await db.schema.hasTable("ingredient_types").then((exists) => {
      if (!exists) {
        return db.schema.createTable("ingredient_types", (t) => {
          t.increments("id").primary();
          t.string("ingredient_type_name", 100).unique().notNullable();
        });
      } else {
        console.log(
          "Table ingredient_types not created. Table already exists."
        );
      }
    });
  } catch (err) {
    throw err;
  }
};

const createIngredientsTable = async () => {
  try {
    await db.schema.hasTable("ingredients").then((exists) => {
      if (!exists) {
        return db.schema.createTable("ingredients", (t) => {
          t.increments("id").primary();
          t.string("ingredient_name", 100).notNullable();
          t.bigint("ingredient_type_id")
            .notNullable()
            .references("id")
            .inTable("ingredient_types");
          t.string("suggestions");
        });
      } else {
        console.log("Table ingredients not created. Table already exists.");
      }
    });
  } catch (err) {
    throw err;
  }
};

const createDrinksTable = async () => {
  try {
    await db.schema.hasTable("drinks").then(function (exists) {
      if (!exists) {
        return db.schema.createTable("drinks", function (t) {
          t.increments("id").primary();
          t.string("drink_name").notNullable();
          t.bigint("category_id")
            .notNullable()
            .references("id")
            .inTable("categories");
          t.string("instructions");
          t.string("glass1", 100);
          t.string("glass2", 100);
          t.integer("rating");
        });
      } else {
        console.log("Table drinks not created. Table already exists.");
      }
    });
  } catch (err) {
    throw err;
  }
};

const createDrinkIngredientsTable = async () => {
  try {
    await db.schema.hasTable("drink_ingredients").then(function (exists) {
      if (!exists) {
        return db.schema.createTable("drink_ingredients", function (t) {
          t.bigint("drink_id").notNullable().references("id").inTable("drinks");
          t.bigint("ingredient_id")
            .notNullable()
            .references("id")
            .inTable("ingredients");
          t.integer("quantity").notNullable();
          t.string("quantity_type").notNullable();
          t.primary(["drink_id", "ingredient_id"]);
        });
      } else {
        console.log(
          "Table drink_ingredients not created. Table already exists."
        );
      }
    });
  } catch (err) {
    throw err;
  }
};

const createDbTables = async () => {
  try {
    await createCategoriesTable();
    await createIngredientTypesTable();
    await createIngredientsTable();
    await createDrinksTable();
    await createDrinkIngredientsTable();
    process.exit(0);
  } catch (err) {
    console.error("Error creating tables: ", err);
    process.exit(1);
  }
};

createDbTables();
