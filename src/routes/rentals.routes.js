import { Router } from "express";
import { validateBody, validateQuery } from "../middlewares/validateSchema.js";
import { bodySchema, querySchema } from "../schemas/rentals.schema.js";
import {
  findController,
  postController,
} from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", validateQuery(querySchema), findController);
rentalsRouter.post("/rentals", validateBody(bodySchema), postController);

export default rentalsRouter;
