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
        g.id AS "gameId",
        g.name AS "gameName",
        c.id AS "customerId",
        c.name AS "customerName"
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

    console.log(query);
    const params = [offset, limit, ...whereParams];
    const { rows } = await pool.query(query, params);

    const restructuredRows = rows.map((row) => {
      const newRow = {
        ...row,
        customer: {
          id: row.customerId,
          name: row.customerName,
        },
        game: {
          id: row.gameId,
          name: row.gameName,
        },
      };

      delete newRow.customerName;
      delete newRow.gameName;

      return newRow;
    });

    return camelCaseRows(restructuredRows);
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
}

export default RentalsRepository;
