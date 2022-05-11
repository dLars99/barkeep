import { Knex } from "knex";
import db from "../util/db";
import {
  Recipe,
  RecipeCardDTO,
  RecipeCreateDTO,
  RecipeDatabaseModel,
  RecipeIngredient,
} from "../models/recipes.model";

export const getRecipes = async (
  id?: number
): Promise<RecipeCardDTO[] | RecipeCardDTO> => {
  const recipes = await db<RecipeDatabaseModel>({ r: "recipes" })
    .select(
      "r.*",
      "categories.name as categoryName",
      "ri.quantity",
      "ri.quantity_type",
      "i.id as ingredientId",
      "i.name as ingredientName",
      "i.suggestions"
    )
    .leftJoin("categories", "r.category_id", "categories.id")
    .leftJoin("recipe_ingredients as ri", "r.id", "ri.recipe_id")
    .leftJoin("ingredients as i", "ri.ingredient_id", "i.id")
    .modify((builder: Knex.QueryBuilder) => {
      if (id) {
        builder.where("r.id", id);
      }
    })
    .catch((err: string) => {
      throw err;
    });
  if (!recipes) {
    throw new Error("Could not get recipes");
  }

  // Rearrange ingredients into nested array
  let index = -1;
  const groupedRecipes = recipes.reduce(
    (assembledRecipes: RecipeCardDTO[], nextRecipe: RecipeDatabaseModel) => {
      const currentIngredient = {
        id: nextRecipe.ingredientId,
        name: nextRecipe.ingredientName,
        suggestions: nextRecipe.suggestions,
        quantity: nextRecipe.quantity,
        quantity_type: nextRecipe.quantity_type,
      };
      if (nextRecipe.id === assembledRecipes[index]?.id) {
        assembledRecipes[index].ingredients.push(currentIngredient);
      } else {
        assembledRecipes.push({
          id: nextRecipe.id,
          name: nextRecipe.name,
          instructions: nextRecipe.instructions,
          category: nextRecipe.categoryName,
          rating: nextRecipe.rating,
          glass1: nextRecipe.glass1,
          glass2: nextRecipe.glass2,
          ingredients: [currentIngredient],
        });
        index++;
      }
      return assembledRecipes;
    },
    []
  );
  return id ? groupedRecipes[0] : groupedRecipes;
};

const addRecipeIngredients = async (
  recipeId: number,
  ingredients: RecipeIngredient[]
): Promise<void> => {
  for (const ingredient of ingredients) {
    const { ingredient_id, quantity, quantity_type } = ingredient;
    const recipeIngredient: RecipeIngredient[] | void =
      await db<RecipeIngredient>("recipe_ingredients")
        .insert(
          { recipe_id: recipeId, ingredient_id, quantity, quantity_type },
          ["*"]
        )
        .catch((err: string) => {
          throw err;
        });
  }
};

export const newRecipe = async (body: RecipeCreateDTO): Promise<Recipe> => {
  const {
    name,
    instructions,
    category_id,
    rating = 0,
    glass1,
    glass2,
    ingredients,
  } = body;
  const recipe: Recipe[] | void = await db<RecipeCreateDTO>("recipes")
    .insert({ name, instructions, category_id, rating, glass1, glass2 }, ["*"])
    .catch((err: string) => {
      throw err;
    });

  if (!recipe) throw new Error("Could not create new Recipe");

  // Link ingredients
  await addRecipeIngredients(recipe[0].id, ingredients);
  return recipe[0];
};

export const updateRecipe = async (body: RecipeCreateDTO): Promise<Recipe> => {
  const {
    id,
    name,
    instructions,
    category_id,
    rating = 0,
    glass1,
    glass2,
    ingredients,
  } = body;

  // Get lists of ingredients to add and remove
  const currentIngredients = await db<RecipeCreateDTO>("recipe_ingredients")
    .select("ingredient_id")
    .where("recipe_id", id)
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
  const recipe: Recipe[] | void = await db<RecipeCreateDTO>("recipes")
    .where({ id })
    .update({ name, instructions, category_id, rating, glass1, glass2 }, ["*"])
    .catch((err: string) => {
      throw err;
    });

  if (ingredientsToAdd) await addRecipeIngredients(id, ingredientsToAdd);

  for (const ingredient of ingredientsToRemove) {
    await db("recipe_ingredients")
      .where({ ingredient_id: ingredient })
      .andWhere({ recipe_id: id })
      .delete()
      .catch((err) => {
        throw err;
      });
  }

  if (ingredientsToUpdate) {
    for (const ingredient of ingredientsToUpdate) {
      const { ingredient_id, quantity, quantity_type } = ingredient;
      const recipeIngredient: RecipeIngredient[] | void =
        await db<RecipeIngredient>("recipe_ingredients")
          .where({ ingredient_id })
          .andWhere({ recipe_id: id })
          .update(
            {
              recipe_id: id,
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

  if (!recipe) throw new Error("Could not create new Recipe");
  return recipe[0];
};
