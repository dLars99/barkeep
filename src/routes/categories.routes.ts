import { Router, Request, Response } from "express";
import { get, post } from "../controllers/categories.controller";

const categoriesRouter = Router();

categoriesRouter.get('/categories', async (req: Request, res: Response) => await get(req, res));

categoriesRouter.post('/categories', async (req: Request, res: Response) => await post(req, res));

export default categoriesRouter;