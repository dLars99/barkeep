import { Knex } from "knex";
import db from "../util/db";
import { Recipe, RecipeCreateDTO, RecipeIngredient } from "../models/recipes.model";

export const getRecipes = async(id?: number): Promise<Recipe[] | Recipe> => {
    const recipes = await db<Recipe>("recipes").select("*")
    .modify((builder: Knex.QueryBuilder) => {
        if (id) {
            builder.where("id", id).first();
        }
    })
    .catch((err: string) => {throw err});
    if (!recipes) {
        throw new Error('Could not get recipes');
    }

    return recipes;
}

export const newRecipe = async (body: RecipeCreateDTO): Promise<Recipe> => {
    const { name, instructions, category_id, rating, glass1, glass2, ingredients } = body;
    try {
        const recipe: Recipe[] | void = await db<Recipe>('recipes')
        .insert( { name, instructions, category_id, rating, glass1, glass2 }, ["*"])
        .catch((err: string) => {
            console.error(err);
        })

        if (!recipe) throw new Error('Could not create new Recipe');

        // Link ingredients
        console.log({recipe})
        for (const ingredient of ingredients) {
            const {ingredient_id, quantity} = ingredient;
            const recipeIngredient = await db('recipe-ingredients')
                .insert({recipe_id: recipe[0].id, ingredient_id, quantity }, ["*"])
                .catch((err: string) => {
                    console.error(err);
                })
        }
        return recipe[0];
    } catch (err: unknown | any) {
        console.error(err)
        return err;
    }
}