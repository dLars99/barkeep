import db from "../util/db";
import data, { GetDrinksOptions } from "../repositories/drinks.respository";
import {
  Drink,
  DrinkCardDTO,
  DrinkCreateDTO,
  DrinkDatabaseModel,
  DrinkIngredient,
} from "../models/drinks.model";

export const getDrinks = async (
  drinkOptions: GetDrinksOptions
): Promise<DrinkCardDTO[] | DrinkCardDTO> => {
  const { id } = drinkOptions;
  const drinks = await data.getDrinks(drinkOptions);
  if (!drinks) {
    throw new Error("Could not get drinks");
  }
  return id ? drinks[0] : drinks;
};

export const getDrinksByIngredients = async (
  ingredientIds: string[],
  limit = 10,
  offset = 0
) => {
  const drinks = await data.getDrinksByIngredients(
    ingredientIds,
    limit,
    offset
  );

  if (!drinks) throw new Error("Could not get drinks");
  return drinks;
};

const addDrinkIngredients = async (
  drinkId: number,
  ingredients: DrinkIngredient[]
): Promise<void> => {
  for (const ingredient of ingredients) {
    const { ingredient_id, quantity, quantity_type } = ingredient;
    const drinkIngredient: DrinkIngredient[] | void = await db<DrinkIngredient>(
      "drink_ingredients"
    )
      .insert({ drink_id: drinkId, ingredient_id, quantity, quantity_type }, [
        "*",
      ])
      .catch((err: string) => {
        throw err;
      });
  }
};

export const newDrink = async (body: DrinkCreateDTO): Promise<Drink> => {
  const drink = await data.insertDrink(body);

  if (!drink) throw new Error("Could not create new Drink");

  const { ingredients } = body;

  // Link ingredients
  await addDrinkIngredients(drink[0].id, ingredients);
  return drink[0];
};

export const updateDrink = async (body: DrinkCreateDTO): Promise<Drink> => {
  const {
    id,
    drink_name,
    instructions,
    category_id,
    rating = 0,
    glass1,
    glass2,
    video_url,
    ingredients,
  } = body;

  // Get lists of ingredients to add and remove
  const currentIngredients = await db<DrinkCreateDTO>("drink_ingredients")
    .select("ingredient_id")
    .where("drink_id", id)
    .then((res) => res.map((ingredient) => ingredient.ingredient_id))
    .catch((err: string) => {
      throw err;
    });

  const ingredientsToAdd = ingredients.filter(
    (ingredient) => !currentIngredients.includes(ingredient.ingredient_id)
  );
  const ingredientsToRemove = currentIngredients.filter(
    (currentIngredient) =>
      !ingredients.some(
        (ingredient) => ingredient.ingredient_id === currentIngredient
      )
  );
  const ingredientsToUpdate = ingredients.filter(
    (ingredient) =>
      !ingredientsToAdd.some(
        (newIngredient) =>
          newIngredient.ingredient_id === ingredient.ingredient_id
      ) || !ingredientsToRemove.includes(ingredient.ingredient_id)
  );

  // Update the DB
  const drink: Drink[] | void = await db<DrinkCreateDTO>("drinks")
    .where({ id })
    .update(
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

  if (ingredientsToAdd) await addDrinkIngredients(id, ingredientsToAdd);

  for (const ingredient of ingredientsToRemove) {
    await db("drink_ingredients")
      .where({ ingredient_id: ingredient })
      .andWhere({ drink_id: id })
      .delete()
      .catch((err) => {
        throw err;
      });
  }

  if (ingredientsToUpdate) {
    for (const ingredient of ingredientsToUpdate) {
      const { ingredient_id, quantity, quantity_type } = ingredient;
      const drinkIngredient: DrinkIngredient[] | void =
        await db<DrinkIngredient>("drink_ingredients")
          .where({ ingredient_id })
          .andWhere({ drink_id: id })
          .update(
            {
              drink_id: id,
              ingredient_id,
              quantity,
              quantity_type,
            },
            ["*"]
          )
          .catch((err: string) => {
            throw err;
          });
    }
  }

  if (!drink) throw new Error("Could not create new drink");
  return drink[0];
};
