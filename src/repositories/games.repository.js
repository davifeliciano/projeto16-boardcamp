import pg from "pg";
import pool from "../database/pool.js";
import camelCaseRows from "./utils/toCamelCase.js";

class GamesRepository {
  static async find({ name, orderField, desc, offset, limit }) {
    const query = `
      SELECT * FROM games
      WHERE ${name !== undefined ? "name ~* $3" : "TRUE"}
      ORDER BY
        ${orderField !== undefined ? pg.escapeIdentifier(orderField) : "TRUE"}
        ${desc ? "DESC" : "ASC"}
      OFFSET $1 LIMIT $2
    `;

    const params = [offset, limit];
    name !== undefined && params.push(name);

    const { rows } = await pool.query(query, params);
    return camelCaseRows(rows);
  }

  static async post({ name, image, stockTotal, pricePerDay }) {
    const selectQuery = `
      SELECT * FROM games
      WHERE name = $1;
    `;

    const { rows: matchedRows } = await pool.query(selectQuery, [name]);

    if (matchedRows.length !== 0) return null;

    const insertQuery = `
      INSERT INTO games
        (name, image, "stockTotal", "pricePerDay")
      VALUES
        ($1, $2, $3, $4)
      RETURNING *;
    `;

    const insertParams = [name, image, stockTotal, pricePerDay];
    const { rows: insertedRows } = await pool.query(insertQuery, insertParams);

    return camelCaseRows(insertedRows);
  }
}

export default GamesRepository;
