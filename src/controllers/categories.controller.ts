import { Request, Response } from "express";
import { getCategories, newCategory } from "../services/categories.service";

export const get = async (req: Request, res: Response): Promise<Response> => {
    const id = req.query.id as string;
    if (id && isNaN(Number(id))) return res.status(400).send("Invalid id");

    try {
        const categories = await getCategories(Number(id));
        return res.json(categories);
    } catch (err: unknown | any) {
        console.error(err);
        return res.status(500).send(err);
    }
}

export const post = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    if (!body || !body.name) return res.status(400).send("Incomplete new type");
    try {
        const createdCategory = newCategory(body);
        return res.status(201).send(createdCategory);
    } catch (err: unknown | any) {
        console.error(err);
        return res.status(500).send(err);
    }
}
