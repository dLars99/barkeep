import { Knex } from "knex";
import db from "../util/db";
import {
  Recipe,
  RecipeCardDTO,
  RecipeCreateDTO,
  RecipeDatabaseModel,
  RecipeDTO,
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
        builder.where("id", id).first();
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
  return groupedRecipes;
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
  for (const ingredient of ingredients) {
    const { ingredient_id, quantity, quantity_type } = ingredient;
    const recipeIngredient: RecipeIngredient[] | void =
      await db<RecipeIngredient>("recipe_ingredients")
        .insert(
          { recipe_id: recipe[0].id, ingredient_id, quantity, quantity_type },
          ["*"]
        )
        .catch((err: string) => {
          throw err;
        });
  }
  return recipe[0];
};
