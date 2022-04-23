import { Router, Request, Response } from "express";
import { get, post, put } from "../controllers/recipes.controller";

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
  "/recipes/:recipeid",
  async (req: Request, res: Response) => await put(req, res)
);

export default recipesRouter;
