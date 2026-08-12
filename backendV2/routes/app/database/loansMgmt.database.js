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
  itemIds,
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

    // Ensure all items exist and collect names + lockers
    const [itemsRows] = await conn.query(
      "SELECT id, item_name, safe_nr FROM items WHERE id IN (?)",
      [itemIds],
    );
    if (!itemsRows || itemsRows.length !== itemIds.length) {
      await conn.rollback();
      return {
        success: false,
        code: "BAD_REQUEST",
        message: "One or more items not found",
      };
    }

    const itemNames = itemIds.map(
      (id) => itemsRows.find((r) => Number(r.id) === Number(id)).item_name,
    );

    // Build lockers array (unique, only 2-digit numbers from safe_nr)
    const lockers = [
      ...new Set(
        itemsRows
          .map((r) => r.safe_nr)
          .filter(
            (sn) =>
              sn !== null &&
              sn !== undefined &&
              Number.isInteger(Number(sn)) &&
              Number(sn) >= 0 &&
              Number(sn) <= 99,
          )
          .map((sn) => Number(sn)),
      ),
    ];

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
      [itemIds, end, start],
    );
    if (confRows?.[0]?.conflicts > 0) {
      await conn.rollback();
      return {
        success: false,
        code: "CONFLICT",
        message: "One or more items are not available in the selected period",
      };
    }

    let index = false;
    let candidate;
    let loanCode;

    // Generates 6-digit loan code
    do {
      candidate = Math.floor(100000 + Math.random() * 899999);

      const [rows] = await conn.query(
        "SELECT 1 FROM loans where loan_code = ? LIMIT 1",
        [candidate],
      );

      if (rows.length == 0) {
        index = true;
        loanCode = candidate;
      }
    } while (index === false);

    // Insert loan (now includes lockers)
    const [insertRes] = await conn.query(
      `
        INSERT INTO loans (username, loan_code, start_date, end_date, lockers, loaned_items_id, loaned_items_name, note)
        VALUES (?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), CAST(? AS JSON), ?)
        `,
      [
        username,
        loanCode,
        new Date(start).toISOString().slice(0, 19).replace("T", " "),
        new Date(end).toISOString().slice(0, 19).replace("T", " "),
        JSON.stringify(lockers),
        JSON.stringify(itemIds.map((n) => Number(n))),
        JSON.stringify(itemNames),
        note,
      ],
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
        lockers,
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
    [username],
  );
  if (result.length > 0) {
    return { success: true, status: true, data: result };
  } else if (result.length === 0) {
    return { success: true, status: true, data: [] };
  }
  return { success: false };
};

export const getBorrowableItemsFromDatabase = async (
  startDate,
  endDate,
  role = 0,
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
        AND l.deleted = 0
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

export const SETdeleteLoanFromDatabase = async (loanId) => {
  const [checkIfdatesReturned] = await pool.query(
    "SELECT take_date, returned_date FROM loans WHERE id = ? AND deleted = 0",
    [loanId],
  );

  if (checkIfdatesReturned.length === 0) {
    return { success: false, code: "LOAN_NOT_FOUND" };
  }

  const { take_date, returned_date } = checkIfdatesReturned[0];
  const bothNull = take_date === null && returned_date === null;
  const bothSet = take_date !== null && returned_date !== null;

  if (!(bothNull || bothSet)) {
    return { success: false, code: "LOAN_NOT_RETURNED" };
  }

  const [result] = await pool.query(
    "UPDATE loans SET deleted = 1 WHERE id = ?;",
    [loanId],
  );
  if (result.affectedRows > 0) {
    return { success: true };
  } else {
    return { success: false };
  }
};

export const getALLLoans = async () => {
  const [result] = await pool.query("SELECT * FROM loans WHERE deleted = 0;");
  if (result.length > 0) {
    return { success: true, data: result };
  }
  return { success: false };
};

export const getItems = async () => {
  const [result] = await pool.query("SELECT * FROM items;");
  if (result.length > 0) {
    return { success: true, data: result };
  }
  return { success: false };
};

export const setReturnDate = async (loanCode) => {
  const [items] = await pool.query(
    "SELECT loaned_items_id FROM loans WHERE loan_code = ?",
    [loanCode],
  );

  const [owner] = await pool.query(
    "SELECT username FROM loans WHERE loan_code = ?",
    [loanCode],
  );

  if (items.length === 0) return { success: false };

  const itemIds = Array.isArray(items[0].loaned_items_id)
    ? items[0].loaned_items_id
    : JSON.parse(items[0].loaned_items_id || "[]");

  const [setItemStates] = await pool.query(
    "UPDATE items SET in_safe = 1, currently_borrowing = NULL, last_borrowed_person = (?) WHERE id IN (?)",
    [owner[0].username, itemIds],
  );

  const [result] = await pool.query(
    "UPDATE loans SET returned_date = NOW() WHERE loan_code = ?",
    [loanCode],
  );

  if (result.affectedRows > 0 && setItemStates.affectedRows > 0) {
    return { success: true };
  }
  return { success: false };
};

export const setTakeDate = async (loanCode) => {
  const [items] = await pool.query(
    "SELECT loaned_items_id FROM loans WHERE loan_code = ?",
    [loanCode],
  );

  const [owner] = await pool.query(
    "SELECT username FROM loans WHERE loan_code = ?",
    [loanCode],
  );

  if (items.length === 0) return { success: false };

  const itemIds = Array.isArray(items[0].loaned_items_id)
    ? items[0].loaned_items_id
    : JSON.parse(items[0].loaned_items_id || "[]");

  const [setItemStates] = await pool.query(
    "UPDATE items SET in_safe = 0, currently_borrowing = (?) WHERE id IN (?)",
    [owner[0].username, itemIds],
  );

  const [result] = await pool.query(
    "UPDATE loans SET take_date = NOW() WHERE loan_code = ?",
    [loanCode],
  );

  if (result.affectedRows > 0 && setItemStates.affectedRows > 0) {
    return { success: true };
  }
  return { success: false };
};
