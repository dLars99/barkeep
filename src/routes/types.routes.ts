import { Router, Request, Response } from "express";
import { get, post } from "../controllers/types.controller";

const typesRouter = Router();

typesRouter.get('/types', async (req: Request, res: Response) => await get(req, res));

typesRouter.post('/types', async (req: Request, res: Response) => await post(req, res));

export default typesRouter;