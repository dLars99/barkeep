import { Knex } from "knex";
import db from "../util/db";
import { Ingredient } from "../models/ingredients.model";

export const getIngredients = async (
  id?: number
): Promise<Ingredient[] | Ingredient> => {
  const ingredients = await db<Ingredient>("ingredients")
    .select("*")
    .modify((builder: Knex.QueryBuilder) => {
      if (id) {
        builder.where("id", id).first();
      }
    })
    .catch((err: string) => {
      throw err;
    });
  if (!ingredients) {
    throw new Error("Could not get ingredients");
  }

  return ingredients;
};

export const newIngredient = async (body: Ingredient): Promise<Ingredient> => {
  const { ingredient_name, ingredient_type_id, suggestions } = body;
  try {
    const ingredient: Ingredient[] | void = await db<Ingredient>("ingredients")
      .insert({ ingredient_name, ingredient_type_id, suggestions }, ["*"])
      .catch((err: string) => {
        console.error(err);
        throw err;
      });

    if (!ingredient) throw new Error("Could not create new ingredient");
    return ingredient[0];
  } catch (err: unknown | any) {
    console.error(err);
    return err;
  }
};
