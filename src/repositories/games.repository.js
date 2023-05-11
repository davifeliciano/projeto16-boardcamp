import pg from "pg";
import pool from "../database/pool.js";
import camelCaseRows from "./utils/toCamelCase.js";

class GamesRepository {
  static async find({ name, order, desc, offset, limit }) {
    const query = `
      SELECT * FROM games
      WHERE ${name !== undefined ? "name ~* $3" : "TRUE"}
      ORDER BY
        ${
          order !== undefined
            ? pg.Client.prototype.escapeIdentifier(order)
            : "TRUE"
        }
        ${desc ? "DESC" : "ASC"}
      OFFSET $1 LIMIT $2
    `;

    const params = [offset, limit];
    name !== undefined && params.push(name);

    const { rows } = await pool.query(query, params);
    return camelCaseRows(rows);
  }

  static async post({ name, image, stockTotal, pricePerDay }) {
    const query = `
      INSERT INTO games
        (name, image, "stockTotal", "pricePerDay")
        (
          SELECT $1, $2, $3, $4
          WHERE NOT EXISTS (
            SELECT 1 FROM games
            WHERE name = $1
          )
        );
    `;

    const params = [name, image, stockTotal, pricePerDay];
    const { rowCount } = await pool.query(query, params);

    return rowCount;
  }
}

export default GamesRepository;
