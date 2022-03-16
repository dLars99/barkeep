import { Request, Response } from "express";
import { getRecipes, newRecipe } from "../services/recipes.service";
import { getCategories } from "../services/categories.service";

export const get = async (req: Request, res: Response): Promise<Response> => {
  const id = req.query.id as string;
  if (id && isNaN(Number(id))) return res.status(400).send("Invalid id");
  try {
    const ingredients = await getRecipes(Number(id));
    return res.json(ingredients);
  } catch (err: unknown | any) {
    console.error(err);
    return res.status(500).send(err);
  }
};

export const post = async (req: Request, res: Response): Promise<Response> => {
  const { body } = req;
  const validCategory = body.type_id && getCategories(body.type_id);
  if (!body.name || !validCategory || !body.ingredients?.length)
    return res.status(400).send("Invalid ingredient");
  try {
    const createdRecipe = await newRecipe(body);
    if (!createdRecipe) throw new Error("Could not create ingredient");
    return res.status(201).send(createdRecipe);
  } catch (err: unknown | any) {
    console.error(err);
    return res.status(500).send(err);
  }
};
