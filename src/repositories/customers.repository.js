import pg from "pg";
import pool from "../database/pool.js";
import camelCaseRows from "./utils/toCamelCase.js";

class CustomersRepository {
  static async find({ cpf, order, desc, offset, limit }) {
    const query = `
      SELECT * FROM customers
      WHERE ${cpf !== undefined ? "cpf ~ $3" : "TRUE"}
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
    cpf !== undefined && params.push(`^${cpf}`);

    const { rows } = await pool.query(query, params);
    return camelCaseRows(rows);
  }

  static async findById(id) {
    const query = `
      SELECT * FROM customers
      WHERE id = $1;
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) return null;

    return camelCaseRows(rows)[0];
  }

  static async post({ name, phone, cpf, birthday }) {
    const selectQuery = `
      SELECT * FROM customers
      WHERE cpf = $1;
    `;

    const { rows: matchedRows } = await pool.query(selectQuery, [cpf]);

    if (matchedRows.length !== 0) return null;

    const insertQuery = `
      INSERT INTO customers
        (name, phone, cpf, birthday)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *;
    `;

    const insertParams = [name, phone, cpf, birthday];
    const { rows: insertedRows } = await pool.query(insertQuery, insertParams);

    return camelCaseRows(insertedRows);
  }
}

export default CustomersRepository;
