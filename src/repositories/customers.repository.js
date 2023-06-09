import pg from "pg";
import pool from "../database/pool.js";
import camelCaseRows from "./utils/toCamelCase.js";

class CustomersRepository {
  static async find({ cpf, order, desc, offset, limit }) {
    const query = `
      SELECT
        id,
        name,
        phone,
        cpf,
        TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday
      FROM customers
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
      SELECT
        id,
        name,
        phone,
        cpf,
        TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday
      FROM customers
      WHERE id = $1;
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) return null;

    return camelCaseRows(rows)[0];
  }

  static async post({ name, phone, cpf, birthday }) {
    const query = `
      INSERT INTO customers
        (name, phone, cpf, birthday)
        (
          SELECT $1, $2, $3, $4
          WHERE NOT EXISTS (
            SELECT 1 FROM customers
            WHERE cpf = $3::VARCHAR
          )
        );
    `;

    const params = [name, phone, cpf, birthday.toISOString()];
    const { rowCount } = await pool.query(query, params);

    return rowCount;
  }

  static async put(id, { name, phone, cpf, birthday }) {
    const query = `
      UPDATE customers
      SET
        name = $2,
        phone = $3,
        cpf = $4,
        birthday = $5
      WHERE id = $1 AND NOT EXISTS (
        SELECT 1 FROM customers
        WHERE cpf = $4 AND id <> $1
      );
    `;

    const params = [id, name, phone, cpf, birthday.toISOString()];
    const { rowCount } = await pool.query(query, params);

    return rowCount;
  }
}

export default CustomersRepository;
