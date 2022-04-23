import { Router, Request, Response } from "express";
import { get, post } from "../controllers/recipes.controller";

const recipesRouter = Router();

recipesRouter.get(
  "/recipes",
  async (req: Request, res: Response) => await get(req, res)
);

recipesRouter.post(
  "/recipes",
  async (req: Request, res: Response) => await post(req, res)
);

recipesRouter.put(
  "/recipes/:recipeId",
  async (req: Request, res: Response) => await post(req, res)
);

export default recipesRouter;
