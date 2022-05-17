import { Knex } from "knex";
import * as seed from "./dataFiles/seedData";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex: Knex) => {
  return seedTable(knex, "categories")
    .then(() => seedTable(knex, "ingredient_types"))
    .then(() => seedTable(knex, "ingredients"))
    .then(() => seedTable(knex, "drinks"))
    .then(() => seedTable(knex, "drink_ingredients"));
};

const seedTable = async (knex: Knex, tableName: keyof typeof seed) => {
  return knex(tableName)
    .del()
    .then(function () {
      return knex(tableName).insert(seed[tableName]);
    });
};
