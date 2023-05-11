import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import pool from "./database/pool.js";
import router from "./routes/index.routes.js";

dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(json());
app.use(cors());

await pool.query("SELECT 1 + 1;");
console.log("Succesfully connected to database");

app.use(router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
