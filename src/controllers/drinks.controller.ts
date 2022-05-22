import { Request, Response } from "express";
import {
  getDrinks,
  getDrinksByIngredients,
  newDrink,
  updateDrink,
} from "../services/drinks.service";
import { getCategories } from "../services/categories.service";

export const get = async (req: Request, res: Response): Promise<Response> => {
  const id = req.query.id as string;
  const query = req.query.query as string;
  const ingredientIds = req.query.ingredientId as string[];
  if (id && isNaN(Number(id))) return res.status(400).send("Invalid id");
  try {
    let ingredients;
    if (ingredientIds?.length) {
      ingredients = await getDrinksByIngredients(ingredientIds);
    } else {
      ingredients = await getDrinks(Number(id), query);
    }
    return res.json(ingredients);
  } catch (err: unknown | any) {
    console.error(err);
    return res.status(500).send(err);
  }
};

export const post = async (req: Request, res: Response): Promise<Response> => {
  const { body } = req;
  try {
    const validCategory = body.category_id && getCategories(body.category_id);
    if (!body.drink_name || !validCategory || !body.ingredients?.length)
      return res.status(400).send("Invalid drink");
    const createdDrink = await newDrink(body);
    if (!createdDrink) res.status(422).send("Unable to create drink");
    return res.status(201).send(createdDrink);
  } catch (err: unknown | any) {
    console.error(err);
    return res.status(500).send(err);
  }
};

export const put = async (req: Request, res: Response): Promise<Response> => {
  const { body } = req;
  const { drinkid } = req.params;
  try {
    const validCategory =
      body.category_id && (await getCategories(body.category_id));
    console.log({ validCategory }, typeof body.id, typeof drinkid);
    if (
      !validCategory ||
      !body.drink_name ||
      !body.ingredients?.length ||
      Number(drinkid) !== body.id
    ) {
      res.status(400).send("Invalid drink");
    }
    const updatedDrink = await updateDrink(body);
    if (!updatedDrink) res.status(422).send("Unable to update drink");
    return res.status(204).send(updatedDrink);
  } catch (err: unknown | any) {
    console.error(err);
    return res.status(500).send(err);
  }
};
