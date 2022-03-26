import { Knex } from "knex";
import db from "../util/db";
import {
  Recipe,
  RecipeCreateDTO,
  RecipeDTO,
  RecipeIngredient,
} from "../models/recipes.model";

export const getRecipes = async (
  id?: number
): Promise<RecipeDTO[] | RecipeDTO> => {
  const recipes = await db<RecipeDTO>({ r: "recipes" })
    .select(
      "r.*",
      "categories.name as categoryName",
      "i.id as ingredientId",
      "i.name as ingredientName",
      "i.suggestions"
    )
    .leftJoin("categories", "r.category_id", "categories.id")
    .leftJoin("recipe_ingredients", "r.id", "recipe_ingredients.recipe_id")
    .leftJoin("ingredients as i", "recipe_ingredients.ingredient_id", "i.id")
    .modify((builder: Knex.QueryBuilder) => {
      if (id) {
        builder.where("id", id).first();
      }
    })
    // .groupBy("r.id")
    .catch((err: string) => {
      throw err;
    });
  if (!recipes) {
    throw new Error("Could not get recipes");
  }
  // Rearrange ingredients into nested array
  let index = -1;
  const groupedRecipes = recipes.reduce(
    (assembledRecipes: any[], nextRecipe: any) => {
      const currentIngredient = {
        id: nextRecipe.ingredientId,
        name: nextRecipe.ingredientName,
        suggestions: nextRecipe.suggestions,
      };
      if (nextRecipe.id === assembledRecipes[index]?.id) {
        console.log("FOUND");
        assembledRecipes[index].ingredients.push(currentIngredient);
      } else {
        nextRecipe.ingredients = [currentIngredient];
        assembledRecipes.push(nextRecipe);
        index++;
      }
      console.log({ assembledRecipes });
      return assembledRecipes;
    },
    []
  );
  console.log(groupedRecipes);
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
  const recipe: Recipe[] | void = await db<Recipe>("recipes")
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
