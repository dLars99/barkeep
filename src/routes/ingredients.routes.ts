import { Router, Request, Response } from "express";
import { get, post } from "../controllers/ingredients.controller";

const categoriesRouter = Router();

categoriesRouter.get('/ingredients', async (req: Request, res: Response) => await get(req, res));

categoriesRouter.post('/ingredients', async (req: Request, res: Response) => await post(req, res));

export default categoriesRouter;