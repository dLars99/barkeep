import data, {
  GetDrinksOptions,
  GetDrinksResult,
} from "../repositories/drinks.respository";
import ingredientData from "../repositories/ingredients.repository";
import drinkIngredientData from "../repositories/drinkIngredients.repository";
import {
  Drink,
  DrinkCardDTO,
  DrinkCreateDTO,
  DrinkIngredient,
} from "../models/drinks.model";

export const getDrinks = async (
  drinkOptions: GetDrinksOptions
): Promise<GetDrinksResult | DrinkCardDTO> => {
  const { id } = drinkOptions;
  const drinks = await data.getDrinks(drinkOptions);
  if (!drinks || !drinks.data) {
    throw new Error("Could not get drinks");
  }
  return id ? drinks.data[0] : drinks;
};

export const getDrinksByIngredients = async (
  ingredientIds: string[],
  limit = 10,
  offset = 0
): Promise<GetDrinksResult> => {
  const drinks = await data.getDrinksByIngredients(
    ingredientIds,
    limit,
    offset
  );

  if (!drinks || !drinks.data) throw new Error("Could not get drinks");
  return drinks;
};

const addDrinkIngredients = async (
  drinkId: number,
  ingredients: DrinkIngredient[]
): Promise<void> => {
  for (const ingredient of ingredients) {
    await drinkIngredientData.addDrinkIngredient(drinkId, ingredient);
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
  const { id, ingredients } = body;

  // Get lists of ingredients to add and remove
  const currentIngredients = await ingredientData.getIngredientIdsByDrink(id);

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

  const drink = await data.updateDrink(body);
  if (!drink) throw new Error("Could not update drink");

  if (ingredientsToAdd) await addDrinkIngredients(id, ingredientsToAdd);

  for (const ingredient of ingredientsToRemove) {
    await drinkIngredientData.deleteDrinkIngredient(id, ingredient);
  }

  if (ingredientsToUpdate) {
    for (const ingredient of ingredientsToUpdate) {
      await drinkIngredientData.updateDrinkIngredient(id, ingredient);
    }
  }

  return drink[0];
};
