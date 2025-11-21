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

export const getAllItems = async () => {
  const [result] = await pool.query("SELECT * FROM items");
  if (result.length > 0) return { success: true, data: result };
  return { success: false };
};

export const deleteItemById = async (itemId) => {
  const [result] = await pool.query("DELETE FROM items WHERE id = ?", [itemId]);
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const createItem = async (item_name, can_borrow_role, lockerNumber) => {
  const [result] = await pool.query(
    "INSERT INTO items (item_name, can_borrow_role, in_safe, safe_nr) VALUES (?, ?, ?, ?)",
    [item_name, can_borrow_role, true, lockerNumber]
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const editItemById = async (itemId, item_name, can_borrow_role) => {
  const [result] = await pool.query(
    "UPDATE items SET item_name = ?, can_borrow_role = ?, entry_updated_at = NOW() WHERE id = ?",
    [item_name, can_borrow_role, itemId]
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const changeSafeState = async (itemId) => {
  const currentState = await pool.query(
    "SELECT in_safe FROM items WHERE id = ?",
    [itemId]
  );
  if (currentState[0].length === 0) {
    return { success: false };
  }

  if (currentState[0][0].in_safe) {
    const [result] = await pool.query(
      "UPDATE items SET in_safe = false WHERE id = ?",
      [itemId]
    );
    if (result.affectedRows > 0) return { success: true };
  }

  if (!currentState[0][0].in_safe) {
    const [result] = await pool.query(
      "UPDATE items SET in_safe = true WHERE id = ?",
      [itemId]
    );
    if (result.affectedRows > 0) return { success: true };
  }

  return { success: false };
};
