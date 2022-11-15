import { Knex } from "knex";
import db from "../util/db";
import {
  Drink,
  DrinkCardDTO,
  DrinkCreateDTO,
  DrinkDatabaseModel,
  DrinkIngredient,
} from "../models/drinks.model";

export type GetDrinksOptions = {
  id?: number;
  limit: number;
  offset?: number;
  query?: string;
};

const getDrinks = async ({
  id,
  query,
  limit,
  offset,
}: GetDrinksOptions): Promise<DrinkCardDTO[]> => {
  return await db<DrinkDatabaseModel>({ d: "drinks" })
    .select(
      "d.*",
      "categories.category_name",
      db.raw(
        "json_agg(json_build_object('id', i.id, 'ingredient_name', i.ingredient_name, 'ingredient_type_id', i.ingredient_type_id, 'ingredient_type_name', it.ingredient_type_name, 'quantity', di.quantity, 'quantity_type', di.quantity_type, 'suggestions', i.suggestions)) as ingredients"
      )
    )
    .leftJoin("categories", "d.category_id", "categories.id")
    .leftJoin("drink_ingredients as di", "d.id", "di.drink_id")
    .leftJoin("ingredients as i", "di.ingredient_id", "i.id")
    .leftJoin("ingredient_types as it", "i.ingredient_type_id", "it.id")
    .modify((builder: Knex.QueryBuilder) => {
      if (id) {
        builder.where("d.id", id);
      }
      if (query) {
        const searchTerms = query.split(" ").map((word: string) => `%${word}%`);
        builder.whereRaw(`d.drink_name ilike any (?)`, [searchTerms]);
      }
    })
    .groupBy("d.id", "categories.category_name")
    .orderBy("d.id")
    .limit(limit || 10)
    .offset(offset || 0)
    .catch((err: string) => {
      throw err;
    });
};

const getDrinksByIngredients = async (
  ingredientIds: string[],
  limit: number,
  offset: number
) => {
  return await db
    .select(
      "dm.*",
      "categories.category_name",
      db.raw(
        "json_agg(json_build_object('id', i.id, 'ingredient_name', i.ingredient_name, 'ingredient_type_id', i.ingredient_type_id, 'ingredient_type_name', it.ingredient_type_name, 'quantity', dmi.quantity, 'quantity_type', dmi.quantity_type, 'suggestions', i.suggestions)) as ingredients"
      )
    )
    .from(
      db({ d: "drinks" })
        .select("d.*")
        .count("di.* as matches")
        .leftJoin("drink_ingredients as di", { "di.drink_id": "d.id" })
        .whereIn("di.ingredient_id", ingredientIds)
        .groupBy("di.drink_id", "d.id")
        .orderBy("matches", "desc")
        .as("dm")
    )
    .leftJoin("categories", "dm.category_id", "categories.id")
    .leftJoin("drink_ingredients as dmi", "dm.id", "dmi.drink_id")
    .leftJoin("ingredients as i", "dmi.ingredient_id", "i.id")
    .leftJoin("ingredient_types as it", "i.ingredient_type_id", "it.id")
    .groupBy(
      "dm.id",
      "dm.drink_name",
      "dm.category_id",
      "dm.instructions",
      "dm.glass1",
      "dm.glass2",
      "dm.rating",
      "dm.video_url",
      "dm.matches",
      "categories.category_name"
    )
    .orderBy("dm.id")
    .limit(limit)
    .offset(offset)
    .catch((err: string) => {
      throw err;
    });
};

const insertDrink = async (body: DrinkCreateDTO): Promise<Drink[]> => {
  const {
    drink_name,
    instructions,
    category_id,
    rating = 0,
    glass1,
    glass2,
    video_url,
  } = body;

  return await db<DrinkCreateDTO>("drinks")
    .insert(
      {
        drink_name,
        instructions,
        category_id,
        rating,
        glass1,
        glass2,
        video_url,
      },
      ["*"]
    )
    .catch((err: string) => {
      throw err;
    });
};

export default { getDrinks, getDrinksByIngredients, insertDrink };
