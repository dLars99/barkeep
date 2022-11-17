import { Router, Request, Response } from "express";
import { get, post, put } from "../controllers/drinks.controller";

const drinksRouter = Router();

drinksRouter.get(
  "/drinks",
  async (req: Request, res: Response) => await get(req, res)
);

drinksRouter.get(
  "/drinks/:drinkid",
  async (req: Request, res: Response) => await get(req, res)
);

drinksRouter.post(
  "/drinks",
  async (req: Request, res: Response) => await post(req, res)
);

drinksRouter.put(
  "/drinks/:drinkid",
  async (req: Request, res: Response) => await put(req, res)
);

export default drinksRouter;
