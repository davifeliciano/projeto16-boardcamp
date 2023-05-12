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
            ? pg.Client.prototype.escapeIdentifier(order)
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
}

export default RentalsRepository;
