import { Router } from "express";
import { validateBody, validateQuery } from "../middlewares/validateSchema.js";
import { bodySchema, querySchema } from "../schemas/games.schema.js";
import {
  findController,
  postController,
} from "../controllers/games.controllers.js";

const gamesRouter = Router();

gamesRouter.get("/games", validateQuery(querySchema), findController);
gamesRouter.post("/games", validateBody(bodySchema), postController);

export default gamesRouter;
