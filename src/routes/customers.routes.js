import { Router } from "express";
import { validateBody, validateQuery } from "../middlewares/validateSchema.js";
import validateId from "../middlewares/validateId.js";
import { bodySchema, querySchema } from "../schemas/customers.schema.js";
import {
  findByIdController,
  findController,
  postController,
  putController,
} from "../controllers/customers.controllers.js";

const customersRouter = Router();

customersRouter.get("/customers", validateQuery(querySchema), findController);
customersRouter.get("/customers/:id", validateId, findByIdController);
customersRouter.post("/customers", validateBody(bodySchema), postController);
customersRouter.put(
  "/customers/:id",
  validateId,
  validateBody(bodySchema),
  putController
);

export default customersRouter;
