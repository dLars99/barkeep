import { Router, Request, Response } from "express";
import { getCategories, post } from "../controllers/categories.controller";

const categoriesRouter = Router();

categoriesRouter.get('/categories', async (req: Request, res: Response) => await getCategories(req, res));

categoriesRouter.post('/categories', async (req: Request, res: Response) => await post(req, res));

export default categoriesRouter;