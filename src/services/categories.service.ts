import { Knex } from "knex";
import db from "../util/db";
import { Category } from "../models/categories.model";

export const getAllCategories = async(id?: number): Promise<Category[] | Category> => {
    const categories = await db<Category>("categories").select("*")
    .modify((builder: Knex.QueryBuilder) => {
        if (id) {
            builder.where("id", id).first();
        }
    })
    .catch((err: string) => {throw err});
    if (!categories) {
        throw new Error('Could not get categories');
    }

    return categories;
}

export const newCategory = async (body: { name: string }): Promise<Category> => {
    const { name } = body;
    try {
        const category: Category[] | void = await db<Category>('categories')
        .insert( { name }, ["*"])
        .catch((err: string) => {
            // tslint:disable-next-line
            console.error(err);
        })

        if (!category) throw new Error('Could not create new category');
        return category[0];
    } catch (err: unknown | any) {
        // tslint:disable-next-line
        console.error(err)
        return err;
    }
}