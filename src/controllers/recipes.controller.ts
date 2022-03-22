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
  const validCategory = body.category_id && getCategories(body.category_id);
  if (!body.name || !validCategory || !body.ingredients?.length)
    return res.status(400).send("Invalid drink");
  try {
    const createdRecipe = await newRecipe(body);
    if (!createdRecipe) res.status(422).send("Unable to create drink");
    return res.status(201).send(createdRecipe);
  } catch (err: unknown | any) {
    console.error(err);
    return res.status(500).send(err);
  }
};
