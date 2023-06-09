import pg from "pg";
import pool from "../database/pool.js";
import camelCaseRows from "./utils/toCamelCase.js";

class RentalsRepository {
  static async find({
    customerId,
    gameId,
    status,
    startDate,
    order,
    desc,
    offset,
    limit,
  }) {
    const paramsValues = [customerId, gameId, startDate];
    const whereFields = ["customerId", "gameId", "rentDate"];
    const whereOperators = ["=", "=", ">"];

    let currentPlaceholder = 3; // $1 and $2 are for OFFSET and LIMIT
    const whereParams = [];
    const whereConditions = [];

    paramsValues.forEach((value, index) => {
      if (value === undefined) return;

      const field = whereFields[index];
      const operator = whereOperators[index];

      whereParams.push(value);
      whereConditions.push(`"${field}" ${operator} $${currentPlaceholder}`);
      currentPlaceholder++;
    });

    const statusCondition = {
      open: 'r."returnDate" IS NULL',
      closed: 'r."returnDate" IS NOT NULL',
    };

    status !== undefined && whereConditions.push(statusCondition[status]);

    const query = `
      SELECT
        r.*,
        JSON_BUILD_OBJECT('id', c.id, 'name', c.name) AS customer,
        JSON_BUILD_OBJECT('id', g.id, 'name', g.name) AS game
      FROM rentals r
      JOIN games g ON g.id = r."gameId"
      JOIN customers c ON c.id = r."customerId"
      WHERE ${
        whereConditions.length > 0 ? whereConditions.join(" AND ") : "TRUE"
      }
      ORDER BY
        ${
          order !== undefined
            ? "r." + pg.Client.prototype.escapeIdentifier(order)
            : "TRUE"
        }
        ${desc ? "DESC" : "ASC"}
      OFFSET $1 LIMIT $2;
    `;

    const params = [offset, limit, ...whereParams];
    const { rows } = await pool.query(query, params);

    return camelCaseRows(rows);
  }

  static async findById(id) {
    const query = `
      SELECT
        r.*,
        JSON_BUILD_OBJECT('id', c.id, 'name', c.name) AS customer,
        JSON_BUILD_OBJECT('id', g.id, 'name', g.name) AS game
      FROM rentals r
      JOIN games g ON g.id = r."gameId"
      JOIN customers c ON c.id = r."customerId"
      WHERE r.id = $1;
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) return null;

    return camelCaseRows(rows)[0];
  }

  static async post({ customerId, gameId, daysRented }) {
    const query = `
      WITH cte (available_games) AS (
        VALUES (
          (
            SELECT "stockTotal" FROM games
            WHERE id = $2
          ) -
          (
            SELECT COUNT(*) FROM rentals
            WHERE "gameId" = $2 AND "returnDate" IS NULL
          )
        )
      )
      INSERT INTO rentals
        (
          "customerId",
          "gameId",
          "rentDate",
          "daysRented",
          "returnDate",
          "originalPrice",
          "delayFee"
        )
        (
          SELECT
            $1, $2, NOW(), $3, NULL,
            (
              SELECT $3 * "pricePerDay"
              FROM games
              WHERE id = $2
            ),
            NULL
          FROM cte
          WHERE EXISTS (
            SELECT 1 FROM customers
            WHERE id = $1
          ) AND EXISTS (
            SELECT 1 FROM games
            WHERE id = $2
          ) AND available_games > 0
        );
    `;

    const params = [customerId, gameId, daysRented];
    const { rowCount } = await pool.query(query, params);

    return rowCount;
  }

  static async return(id) {
    const query = `
      WITH cte (delay_fee) AS (
        VALUES (
          (
            SELECT (NOW()::DATE - "rentDate") - "daysRented"
            FROM rentals
            WHERE id = $1
          ) *
          (
            SELECT g."pricePerDay"
            FROM rentals r
            JOIN games g ON g.id = r."gameId"
            WHERE r.id = $1
          )
        )
      )
      UPDATE rentals r
      SET
        "returnDate" = NOW(),
        "delayFee" = (
          SELECT
            CASE
              WHEN delay_fee >= 0 THEN delay_fee
              WHEN delay_fee < 0 THEN 0
            END
          FROM cte
        )
      WHERE id = $1 AND "returnDate" IS NULL;
    `;

    const { rowCount } = await pool.query(query, [id]);

    return rowCount;
  }

  static async delete(id) {
    const query = `
      DELETE FROM rentals
      WHERE id = $1 AND "returnDate" IS NOT NULL;
    `;

    const { rowCount } = await pool.query(query, [id]);

    return rowCount;
  }
}

export default RentalsRepository;
