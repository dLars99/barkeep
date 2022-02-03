import { Router, Request, Response } from "express";
import { get, post } from "../controllers/ingredients.controller";

const ingredientsRouter = Router();

ingredientsRouter.get(
  "/ingredients",
  async (req: Request, res: Response) => await get(req, res)
);

ingredientsRouter.post(
  "/ingredients",
  async (req: Request, res: Response) => await post(req, res)
);

export default ingredientsRouter;
