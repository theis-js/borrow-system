import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })
  .promise();

export const loginFunc = async (username, password) => {
  const [result] = await pool.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password]
  );
  if (result.length > 0) return { success: true, data: result[0] };
  return { success: false };
};

export const getItemsFromDatabaseV2 = async () => {
  const [rows] = await pool.query("SELECT * FROM items;");
  if (rows.length > 0) {
    return { success: true, data: rows };
  }
  return { success: false };
};

export const getLoanByCodeV2 = async (loan_code) => {
  const [result] = await pool.query(
    "SELECT * FROM loans WHERE loan_code = ?;",
    [loan_code]
  );
  if (result.length > 0) {
    return { success: true, data: result[0] };
  }
  return { success: false };
};

export const changeInSafeStateV2 = async (itemId, state) => {
  const [result] = await pool.query(
    "UPDATE items SET inSafe = ? WHERE id = ?",
    [state, itemId]
  );
  if (result.affectedRows > 0) {
    return { success: true };
  }
  return { success: false };
};

export const setReturnDateV2 = async (loanCode) => {
  const [result] = await pool.query(
    "UPDATE loans SET returned_date = NOW() WHERE loan_code = ?",
    [loanCode]
  );
  if (result.affectedRows > 0) {
    return { success: true };
  }
  return { success: false };
};

export const setTakeDateV2 = async (loanCode) => {
  const [result] = await pool.query(
    "UPDATE loans SET take_date = NOW() WHERE loan_code = ?",
    [loanCode]
  );
  if (result.affectedRows > 0) {
    return { success: true };
  }
  return { success: false };
};

export const getItemsFromDatabase = async (role) => {
  const sql =
    role == 0
      ? "SELECT * FROM items;"
      : "SELECT * FROM items WHERE can_borrow_role >= ?";
  const params = role == 0 ? [] : [role];

  const [rows] = await pool.query(sql, params);
  if (rows.length > 0) {
    return { success: true, data: rows };
  }
  return { success: false };
};

export const getLoansFromDatabase = async () => {
  const [result] = await pool.query("SELECT * FROM loans;");
  if (result.length > 0) {
    return { success: true, data: result };
  }
  return { success: false };
};

export const getUserLoansFromDatabase = async (username) => {
  const [result] = await pool.query("SELECT * FROM loans WHERE username = ?;", [
    username,
  ]);
  if (result.length > 0) {
    return { success: true, data: result };
  } else if (result.length == 0) {
    return { success: true, data: "No loans found for this user" };
  } else {
    return { success: false };
  }
};

export const deleteLoanFromDatabase = async (loanId) => {
  const [result] = await pool.query("DELETE FROM loans WHERE id = ?;", [
    loanId,
  ]);
  if (result.affectedRows > 0) {
    return { success: true };
  } else {
    return { success: false };
  }
};

export const getBorrowableItemsFromDatabase = async (
  startDate,
  endDate,
  role = 0
) => {
  // Overlap if: loan.start < end AND effective_end > start
  // effective_end is returned_date if set, otherwise end_date
  const hasRoleFilter = Number(role) > 0;

  const sql = `
    SELECT i.*
    FROM items i
    WHERE ${hasRoleFilter ? "i.can_borrow_role >= ? AND " : ""}NOT EXISTS (
      SELECT 1
      FROM loans l
      JOIN JSON_TABLE(l.loaned_items_id, '$[*]' COLUMNS (item_id INT PATH '$')) jt
      WHERE jt.item_id = i.id
        AND l.start_date < ?
        AND COALESCE(l.returned_date, l.end_date) > ?
    );
  `;

  const params = hasRoleFilter
    ? [role, endDate, startDate]
    : [endDate, startDate];

  const [rows] = await pool.query(sql, params);
  if (rows.length > 0) {
    return { success: true, data: rows };
  }
  return { success: false };
};

export const createLoanInDatabase = async (
  username,
  startDate,
  endDate,
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
      const candidate = Math.floor(1000 + Math.random() * 900000); // 4-6 digits
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
      INSERT INTO loans (username, loan_code, start_date, end_date, loaned_items_id, loaned_items_name)
      VALUES (?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON))
      `,
      [
        username,
        loanCode,
        // Use DATETIME/TIMESTAMP friendly format
        new Date(start).toISOString().slice(0, 19).replace("T", " "),
        new Date(end).toISOString().slice(0, 19).replace("T", " "),
        JSON.stringify(itemIds.map((n) => Number(n))),
        JSON.stringify(itemNames),
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

// These functions are only temporary, and will be deleted when the full bin is set up.

export const onTake = async (loanId) => {
  const [result] = await pool.query(
    "UPDATE loans SET take_date = NOW() WHERE id = ?",
    [loanId]
  );

  if (result.affectedRows > 0) {
    return { success: true };
  }
  return { success: false };
};

export const onReturn = async (loanId) => {
  const [result] = await pool.query(
    "UPDATE loans SET returned_date = NOW() WHERE id = ?",
    [loanId]
  );

  if (result.affectedRows > 0) {
    return { success: true };
  }
  return { success: false };
};
