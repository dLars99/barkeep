import { Knex } from "knex";
import db from "../util/db";
import { IngredientType } from "../models/types.model";

export const getTypes = async (
  id?: number
): Promise<IngredientType[] | IngredientType> => {
  const types = await db<IngredientType>("ingredient_types")
    .select("*")
    .modify((builder: Knex.QueryBuilder) => {
      if (id) {
        builder.where("id", id).first();
      }
    })
    .catch((err: string) => {
      throw err;
    });
  if (!types) {
    throw new Error("Could not get types");
  }

  return types;
};

export const newType = async (body: {
  ingredient_type_name: string;
}): Promise<IngredientType> => {
  const { ingredient_type_name } = body;
  try {
    const type: IngredientType[] | void = await db<IngredientType>(
      "ingredient_types"
    )
      .insert({ ingredient_type_name }, ["*"])
      .catch((err: string) => {
        console.error(err);
      });

    if (!type) throw new Error("Could not create new type");
    return type[0];
  } catch (err: unknown | any) {
    console.error(err);
    return err;
  }
};
