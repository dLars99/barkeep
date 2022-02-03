import { Request, Response } from "express";
import { getIngredients, newIngredient } from "../services/ingredients.service";
import { getTypes } from "../services/types.service";

export const get = async (req: Request, res: Response): Promise<Response> => {
    const id = req.query.id as string;
    if (id && isNaN(Number(id))) return res.status(400).send("Invalid id");
    try {
        const ingredients = await getIngredients(Number(id));
        return res.json(ingredients);
    } catch (err: unknown | any) {
        console.error(err);
        return res.status(500).send(err);
    }
}

export const post = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    const validType = body.type_id && getTypes(body.type_id);
    if (!body.name || !validType) return res.status(400).send("Invalid ingredient");
    try {
        const createdIngredient = newIngredient(body);
        if (!createdIngredient) throw new Error("Could not create ingredient");
        return res.status(201).send(createdIngredient);
    } catch (err: unknown | any) {
        console.error(err);
        return res.status(500).send(err);
    }
}
