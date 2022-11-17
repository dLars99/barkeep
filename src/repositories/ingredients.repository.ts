import { DrinkCreateDTO } from "../models/drinks.model";
import db from "../util/db";

const getIngredientIdsByDrink = async (drinkId: number) =>
  await db<DrinkCreateDTO>("drink_ingredients")
    .select("ingredient_id")
    .where("drink_id", drinkId)
    .then((res) => res.map((ingredient) => ingredient.ingredient_id))
    .catch((err: string) => {
      throw err;
    });

export default { getIngredientIdsByDrink };
