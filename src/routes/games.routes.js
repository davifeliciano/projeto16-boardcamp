import { Router } from "express";
import { validateBody, validateQuery } from "../middlewares/validateSchema.js";
import {
  bodySchema as gamesBodySchema,
  querySchema as gamesQuerySchema,
} from "../schemas/games.schema.js";

import {
  findController,
  postController,
} from "../controllers/games.controllers.js";

const gamesRouter = Router();

gamesRouter.get("/games", validateQuery(gamesQuerySchema), findController);
gamesRouter.post("/games", validateBody(gamesBodySchema), postController);

export default gamesRouter;
