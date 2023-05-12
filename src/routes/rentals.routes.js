import { Router } from "express";
import { validateQuery } from "../middlewares/validateSchema.js";
import { querySchema } from "../schemas/rentals.schema.js";
import { findController } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", validateQuery(querySchema), findController);

export default rentalsRouter;
