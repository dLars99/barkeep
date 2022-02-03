import { Knex } from "knex";
import db from "../util/db";
import { Ingredient } from "../models/ingredients.model";

export const getIngredients = async(id?: number): Promise<Ingredient[] | Ingredient> => {
    const ingredients = await db<Ingredient>("ingredients").select("*")
    .modify((builder: Knex.QueryBuilder) => {
        if (id) {
            builder.where("id", id).first();
        }
    })
    .catch((err: string) => {throw err});
    if (!ingredients) {
        throw new Error('Could not get ingredients');
    }

    return ingredients;
}

export const newIngredient = async (body: Ingredient): Promise<Ingredient> => {
    const { name, type_id, suggestions } = body;
    try {
        const ingredient: Ingredient[] | void = await db<Ingredient>('ingredients')
        .insert( { name, type_id, suggestions }, ["*"])
        .catch((err: string) => {
            // tslint:disable-next-line
            console.error(err);
        })

        if (!ingredient) throw new Error('Could not create new ingredient');
        return ingredient[0];
    } catch (err: unknown | any) {
        // tslint:disable-next-line
        console.error(err)
        return err;
    }
}