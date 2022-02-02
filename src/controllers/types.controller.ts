import { Request, Response } from "express";
import { getAllTypes, newType } from "../services/types.service";

export const getTypes = async (req: Request, res: Response): Promise<Response> => {
    const id = req.query.id as string;
    if (id && isNaN(Number(id))) return res.status(400).send("Invalid id");

    try {
        const types = await getAllTypes(Number(id));
        return res.json(types);
    } catch (err: unknown | any) {
        // tslint:disable-next-line
        console.error(err);
        return res.status(500).send(err);
    }
}

export const post = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    if (!body || !body.name) return res.status(400).send("Incomplete new type");
    try {
        const createdType = newType(body);
        return res.status(201).send(createdType);
    } catch (err: unknown | any) {
        // tslint:disable-next-line
        console.error(err);
        return res.status(500).send(err);
    }
}
