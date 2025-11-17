import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .promise();

export const createLoanInDatabase = async (
  username,
  startDate,
  endDate,
  note,
  itemIds
) => {
  if (!username)
    return { success: false, code: "BAD_REQUEST", message: "Missing username" };
  if (!Array.isArray(itemIds) || itemIds.length === 0)
    return {
      success: false,
      code: "BAD_REQUEST",
      message: "No items provided",
    };
  if (!startDate || !endDate)
    return { success: false, code: "BAD_REQUEST", message: "Missing dates" };

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (
    !(start instanceof Date) ||
    isNaN(start.getTime()) ||
    !(end instanceof Date) ||
    isNaN(end.getTime()) ||
    start >= end
  ) {
    return {
      success: false,
      code: "BAD_REQUEST",
      message: "Invalid date range",
    };
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Ensure all items exist and collect names
    const [itemsRows] = await conn.query(
      "SELECT id, item_name FROM items WHERE id IN (?)",
      [itemIds]
    );
    if (!itemsRows || itemsRows.length !== itemIds.length) {
      await conn.rollback();
      return {
        success: false,
        code: "BAD_REQUEST",
        message: "One or more items not found",
      };
    }
    const itemNames = itemIds
      .map(
        (id) => itemsRows.find((r) => Number(r.id) === Number(id))?.item_name
      )
      .filter(Boolean);

    // Check availability (no overlap with existing loans)
    const [confRows] = await conn.query(
      `
        SELECT COUNT(*) AS conflicts
        FROM loans l
        JOIN JSON_TABLE(l.loaned_items_id, '$[*]' COLUMNS (item_id INT PATH '$')) jt
          ON TRUE
        WHERE jt.item_id IN (?)
          AND l.deleted = 0
          AND l.start_date < ?
          AND COALESCE(l.returned_date, l.end_date) > ?
        `,
      [itemIds, end, start]
    );
    if (confRows?.[0]?.conflicts > 0) {
      await conn.rollback();
      return {
        success: false,
        code: "CONFLICT",
        message: "One or more items are not available in the selected period",
      };
    }

    // Generate unique loan_code (retry a few times)
    let loanCode = null;
    for (let i = 0; i < 6; i++) {
      const candidate = Math.floor(100000 + Math.random() * 899999); // 6 digits
      const [exists] = await conn.query(
        "SELECT 1 FROM loans WHERE loan_code = ? LIMIT 1",
        [candidate]
      );
      if (exists.length === 0) {
        loanCode = candidate;
        break;
      }
    }
    if (!loanCode) {
      await conn.rollback();
      return {
        success: false,
        code: "SERVER_ERROR",
        message: "Failed to generate unique loan code",
      };
    }

    // Insert loan
    const [insertRes] = await conn.query(
      `
        INSERT INTO loans (username, loan_code, start_date, end_date, loaned_items_id, loaned_items_name, note)
        VALUES (?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), ?)
        `,
      [
        username,
        loanCode,
        // Use DATETIME/TIMESTAMP friendly format
        new Date(start).toISOString().slice(0, 19).replace("T", " "),
        new Date(end).toISOString().slice(0, 19).replace("T", " "),
        JSON.stringify(itemIds.map((n) => Number(n))),
        JSON.stringify(itemNames),
        note,
      ]
    );

    await conn.commit();
    return {
      success: true,
      data: {
        id: insertRes.insertId,
        loan_code: loanCode,
        username,
        start_date: start,
        end_date: end,
        items: itemIds,
        item_names: itemNames,
      },
    };
  } catch (err) {
    await conn.rollback();
    console.error("createLoanInDatabase error:", err);
    return {
      success: false,
      code: "SERVER_ERROR",
      message: "Failed to create loan",
    };
  } finally {
    conn.release();
  }
};

export const getLoanInfoWithID = async (loanId) => {
  const [rows] = await pool.query("SELECT * FROM loans WHERE id = ?;", [
    loanId,
  ]);
  if (rows.length > 0) {
    return { success: true, data: rows[0] };
  }
  return { success: false };
};

export const getLoansFromDatabase = async (username) => {
  const [result] = await pool.query(
    "SELECT * FROM loans WHERE username = ? AND deleted = 0;",
    [username]
  );
  if (result.length > 0) {
    return { success: true, data: result };
  }
  return { success: false };
};
