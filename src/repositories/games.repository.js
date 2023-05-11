import pg from "pg";
import pool from "../database/pool.js";
import camelCaseRows from "./utils/toCamelCase.js";

class GamesRepository {
  static async find({ name, orderField, desc, offset, limit }) {
    const query = `
      SELECT * FROM games
      WHERE ${name !== undefined ? "name ~* $3 " : "TRUE"}
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
}

export default GamesRepository;
