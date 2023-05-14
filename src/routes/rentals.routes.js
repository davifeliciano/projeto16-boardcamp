import { Router } from "express";
import { validateBody, validateQuery } from "../middlewares/validateSchema.js";
import validateId from "../middlewares/validateId.js";
import { bodySchema, querySchema } from "../schemas/rentals.schema.js";
import {
  deleteController,
  findController,
  postController,
  returnController,
} from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", validateQuery(querySchema), findController);
rentalsRouter.post("/rentals", validateBody(bodySchema), postController);
rentalsRouter.post("/rentals/:id/return", validateId, returnController);
rentalsRouter.delete("/rentals/:id", validateId, deleteController);

export default rentalsRouter;
