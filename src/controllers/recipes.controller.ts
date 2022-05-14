import { Request, Response } from "express";
import {
  getRecipes,
  getRecipesByIngredients,
  newRecipe,
  updateRecipe,
} from "../services/recipes.service";
import { getCategories } from "../services/categories.service";

export const get = async (req: Request, res: Response): Promise<Response> => {
  const id = req.query.id as string;
  const query = req.query.query as string;
  const ingredientIds = req.query.ingredientId as string[];
  console.log({ ingredientIds });
  if (id && isNaN(Number(id))) return res.status(400).send("Invalid id");
  try {
    let ingredients;
    if (ingredientIds?.length) {
      ingredients = await getRecipesByIngredients(ingredientIds);
    } else {
      ingredients = await getRecipes(Number(id), query);
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
    if (!body.name || !validCategory || !body.ingredients?.length)
      return res.status(400).send("Invalid drink");
    const createdRecipe = await newRecipe(body);
    if (!createdRecipe) res.status(422).send("Unable to create drink");
    return res.status(201).send(createdRecipe);
  } catch (err: unknown | any) {
    console.error(err);
    return res.status(500).send(err);
  }
};

export const put = async (req: Request, res: Response): Promise<Response> => {
  const { body } = req;
  const { recipeid } = req.params;
  try {
    const validCategory = body.category_id && getCategories(body.category_id);
    if (
      !validCategory ||
      !body.name ||
      !body.ingredients?.length ||
      recipeid !== body.id
    ) {
      res.status(400).send("Invalid drink recipe");
    }
    const updatedDrink = await updateRecipe(body);
    if (!updatedDrink) res.status(422).send("Unable to update drink");
    return res.status(204).send(updatedDrink);
  } catch (err: unknown | any) {
    console.error(err);
    return res.status(500).send(err);
  }
};
