import { Router } from "express";
import { validateQuery } from "../middlewares/validateSchema.js";
import { querySchema as gamesQuerySchema } from "../schemas/games.schema.js";
import { findController } from "../controllers/games.controllers.js";

const gamesRouter = Router();

gamesRouter.get("/games", validateQuery(gamesQuerySchema), findController);

export default gamesRouter;
