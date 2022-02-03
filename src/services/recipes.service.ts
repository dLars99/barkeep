import { Knex } from "knex";
import db from "../util/db";
import { Recipe } from "../models/recipes.model";

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

export const newRecipe = async (body: { name: string }): Promise<Recipe> => {
    const { name } = body;
    try {
        const recipe: Recipe[] | void = await db<Recipe>('recipes')
        .insert( { name }, ["*"])
        .catch((err: string) => {
            // tslint:disable-next-line
            console.error(err);
        })

        if (!recipe) throw new Error('Could not create new Recipe');
        return recipe[0];
    } catch (err: unknown | any) {
        // tslint:disable-next-line
        console.error(err)
        return err;
    }
}