import { Knex } from "knex";
import db from "../util/db";
import {
  Drink,
  DrinkCardDTO,
  DrinkCreateDTO,
  DrinkDatabaseModel,
  DrinkIngredient,
} from "../models/drinks.model";

export const getDrinks = async (
  id?: number,
  query?: string
): Promise<DrinkCardDTO[] | DrinkCardDTO> => {
  const drinks = await db<DrinkDatabaseModel>({ d: "drinks" })
    .select(
      "d.*",
      "categories.category_name",
      "di.quantity",
      "di.quantity_type",
      "i.id as ingredientId",
      "i.ingredient_name",
      "i.suggestions"
    )
    .leftJoin("categories", "d.category_id", "categories.id")
    .leftJoin("drink_ingredients as di", "d.id", "di.drink_id")
    .leftJoin("ingredients as i", "di.ingredient_id", "i.id")
    .modify((builder: Knex.QueryBuilder) => {
      if (id) {
        builder.where("d.id", id);
      }
      if (query) {
        const searchTerms = query.split(" ").map((word: string) => `%${word}%`);
        builder.whereRaw(`drinks.drink_name ilike any (?)`, [searchTerms]);
      }
    })
    .catch((err: string) => {
      throw err;
    });
  if (!drinks) {
    throw new Error("Could not get drinks");
  }

  const groupedDrinks = assembleGroupedDrinks(drinks);
  return id ? groupedDrinks[0] : groupedDrinks;
};

// Rearrange ingredients into nested array
const assembleGroupedDrinks = (
  drinks: DrinkDatabaseModel[]
): DrinkCardDTO[] => {
  let index = -1;
  return drinks.reduce(
    (assembledDrinks: DrinkCardDTO[], nextDrink: DrinkDatabaseModel) => {
      const currentIngredient = {
        id: nextDrink.ingredientId,
        ingredient_name: nextDrink.ingredient_name,
        suggestions: nextDrink.suggestions,
        quantity: nextDrink.quantity,
        quantity_type: nextDrink.quantity_type,
      };
      if (nextDrink.id === assembledDrinks[index]?.id) {
        assembledDrinks[index].ingredients.push(currentIngredient);
      } else {
        assembledDrinks.push({
          id: nextDrink.id,
          drink_name: nextDrink.drink_name,
          instructions: nextDrink.instructions,
          category: nextDrink.category_name,
          rating: nextDrink.rating,
          glass1: nextDrink.glass1,
          glass2: nextDrink.glass2,
          ingredients: [currentIngredient],
        });
        index++;
        if (nextDrink.matches)
          assembledDrinks[index].matches = nextDrink.matches;
      }
      return assembledDrinks;
    },
    []
  );
};

export const getDrinksByIngredients = async (ingredientIds: string[]) => {
  const drinks = await db
    .select(
      "dm.*",
      "categories.category_name",
      "dmi.quantity",
      "dmi.quantity_type",
      "i.id as ingredientId",
      "i.ingredient_name",
      "i.suggestions"
    )
    .from(
      db({ r: "drinks" })
        .select("d.*")
        .count("di.id as matches")
        .leftJoin("drink_ingredients as di", { "di.drink_id": "d.id" })
        .whereIn("di.ingredient_id", ingredientIds)
        .groupBy("di.drink_id", "d.id")
        .orderBy("matches", "desc")
        .as("dm")
    )
    .leftJoin("categories", "dm.category_id", "categories.id")
    .leftJoin("drink_ingredients as dmi", "dm.id", "dmi.drink_id")
    .leftJoin("ingredients as i", "dmi.ingredient_id", "i.id")
    .catch((err: string) => {
      throw err;
    });

  if (!drinks) throw new Error("Could not get drinks");

  const groupedDrinks = assembleGroupedDrinks(drinks);
  return groupedDrinks;
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
  const {
    drink_name,
    instructions,
    category_id,
    rating = 0,
    glass1,
    glass2,
    ingredients,
  } = body;
  const drink: Drink[] | void = await db<DrinkCreateDTO>("drinks")
    .insert({ drink_name, instructions, category_id, rating, glass1, glass2 }, [
      "*",
    ])
    .catch((err: string) => {
      throw err;
    });

  if (!drink) throw new Error("Could not create new Drink");

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
    .update({ drink_name, instructions, category_id, rating, glass1, glass2 }, [
      "*",
    ])
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
