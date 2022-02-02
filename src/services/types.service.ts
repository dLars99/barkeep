import { Knex } from "knex";
import db from "../util/db";
import { IngredientType } from "../models/types.model";

export const getAllTypes = async(id?: number): Promise<IngredientType[] | IngredientType> => {
    const types = await db<IngredientType>("ingredient_types").select("*")
    .modify((builder: Knex.QueryBuilder) => {
        if (id) {
            builder.where("id", id).first();
        }
    })
    .catch((err: string) => {throw err});
    if (!types) {
        throw new Error('Could not get types');
    }

    return types;
}

export const newType = async (body: { name: string }): Promise<IngredientType> => {
    const { name } = body;
    try {
        const type: IngredientType[] | void = await db<IngredientType>('ingredient_types')
        .insert( { name }, ["*"])
        .catch((err: string) => {
            // tslint:disable-next-line
            console.error(err);
        })

        if (!type) throw new Error('Could not create new type');
        return type[0];
    } catch (err: unknown | any) {
        // tslint:disable-next-line
        console.error(err)
        return err;
    }
}