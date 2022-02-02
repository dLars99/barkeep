import { Router, Request, Response } from "express";
import { getTypes, post } from "../controllers/types.controller";

const typesRouter = Router();

typesRouter.get('/types', async (req: Request, res: Response) => await getTypes(req, res));

typesRouter.post('/types', async (req: Request, res: Response) => await post(req, res));

export default typesRouter;