import { Router } from "express";
import { validateBody, validateQuery } from "../middlewares/validateSchema.js";
import validateId from "../middlewares/validateId.js";
import { bodySchema, querySchema } from "../schemas/customers.schema.js";
import {
  findByIdController,
  findController,
  postController,
} from "../controllers/customers.controllers.js";

const customersRouter = Router();

customersRouter.get("/customers", validateQuery(querySchema), findController);
customersRouter.get("/customers/:id", validateId, findByIdController);
customersRouter.post("/customers", validateBody(bodySchema), postController);

export default customersRouter;
