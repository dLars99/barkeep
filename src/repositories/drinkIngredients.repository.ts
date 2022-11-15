import { DrinkIngredient } from "../models/drinks.model";
import db from "../util/db";

const addDrinkIngredient = async (
  drinkId: number,
  ingredient: DrinkIngredient
): Promise<void> => {
  const { ingredient_id, quantity, quantity_type } = ingredient;
  db<DrinkIngredient>("drink_ingredients")
    .insert({ drink_id: drinkId, ingredient_id, quantity, quantity_type }, [
      "*",
    ])
    .catch((err: string) => {
      throw err;
    });
};

const updateDrinkIngredient = async (
  drinkId: number,
  ingredient: DrinkIngredient
): Promise<void> => {
  const { ingredient_id, quantity, quantity_type } = ingredient;
  await db<DrinkIngredient>("drink_ingredients")
    .where({ ingredient_id })
    .andWhere({ drink_id: drinkId })
    .update(
      {
        drink_id: drinkId,
        ingredient_id,
        quantity,
        quantity_type,
      },
      ["*"]
    )
    .catch((err: string) => {
      throw err;
    });
};

const deleteDrinkIngredient = async (
  drinkId: number,
  ingredientId: number
): Promise<void> => {
  await db("drink_ingredients")
    .where({ ingredient_id: ingredientId })
    .andWhere({ drink_id: drinkId })
    .delete()
    .catch((err) => {
      throw err;
    });
};

export default {
  addDrinkIngredient,
  updateDrinkIngredient,
  deleteDrinkIngredient,
};
