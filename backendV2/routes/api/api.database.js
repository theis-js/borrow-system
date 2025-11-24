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

export const getItemsFromDatabaseV2 = async () => {
  const [rows] = await pool.query("SELECT * FROM items;");
  if (rows.length > 0) {
    return { success: true, data: rows };
  }
  return { success: false };
};

export const getLoanByCodeV2 = async (loan_code) => {
  const [result] = await pool.query(
    "SELECT username, returned_date, take_date, lockers FROM loans WHERE loan_code = ?;",
    [loan_code]
  );
  if (result.length > 0) {
    return { success: true, data: result[0] };
  }
  return { success: false };
};

export const changeInSafeStateV2 = async (itemId) => {
  const [result] = await pool.query(
    "UPDATE items SET in_safe = NOT in_safe WHERE id = ?",
    [itemId]
  );
  if (result.affectedRows > 0) {
    return { success: true };
  }
  return { success: false };
};

export const setReturnDateV2 = async (loanCode) => {
  const [items] = await pool.query(
    "SELECT loaned_items_id FROM loans WHERE loan_code = ?",
    [loanCode]
  );

  const [owner] = await pool.query(
    "SELECT username FROM loans WHERE loan_code = ?",
    [loanCode]
  );

  if (items.length === 0) return { success: false };

  const itemIds = Array.isArray(items[0].loaned_items_id)
    ? items[0].loaned_items_id
    : JSON.parse(items[0].loaned_items_id || "[]");

  const [setItemStates] = await pool.query(
    "UPDATE items SET in_safe = 1, currently_borrowing = NULL, last_borrowed_person = (?) WHERE id IN (?)",
    [owner[0].username, itemIds]
  );

  const [result] = await pool.query(
    "UPDATE loans SET returned_date = NOW() WHERE loan_code = ?",
    [loanCode]
  );

  if (result.affectedRows > 0 && setItemStates.affectedRows > 0) {
    return { success: true };
  }
  return { success: false };
};

export const setTakeDateV2 = async (loanCode) => {
  const [items] = await pool.query(
    "SELECT loaned_items_id FROM loans WHERE loan_code = ?",
    [loanCode]
  );

  const [owner] = await pool.query(
    "SELECT username FROM loans WHERE loan_code = ?",
    [loanCode]
  );

  if (items.length === 0) return { success: false };

  const itemIds = Array.isArray(items[0].loaned_items_id)
    ? items[0].loaned_items_id
    : JSON.parse(items[0].loaned_items_id || "[]");

  const [setItemStates] = await pool.query(
    "UPDATE items SET in_safe = 0, currently_borrowing = (?) WHERE id IN (?)",
    [owner[0].username, itemIds]
  );

  const [result] = await pool.query(
    "UPDATE loans SET take_date = NOW() WHERE loan_code = ?",
    [loanCode]
  );

  if (result.affectedRows > 0 && setItemStates.affectedRows > 0) {
    return { success: true };
  }
  return { success: false };
};

export const getAllLoansV2 = async () => {
  const [result] = await pool.query("SELECT * FROM loans;");
  if (result.length > 0) {
    return { success: true, data: result };
  }
  return { success: false };
};

export const openDoor = async (doorKey) => {
  const [result] = await pool.query(
    "SELECT lockers FROM doorKeys WHERE door_key = ?;",
    [doorKey]
  );
  if (result.length > 0) {
    return { success: true, data: result[0] };
  }
  return { success: false };
};
