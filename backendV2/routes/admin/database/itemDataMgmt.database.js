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

export const createItem = async (item_name, can_borrow_role, in_safe) => {
  const [result] = await pool.query(
    "INSERT INTO items (item_name, can_borrow_role, in_safe) VALUES (?, ?, ?)",
    [item_name, can_borrow_role, in_safe]
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const editItemById = async (itemId, item_name, can_borrow_role) => {
  const [result] = await pool.query(
    "UPDATE items SET item_name = ?, can_borrow_role = ? WHERE id = ?",
    [item_name, can_borrow_role, itemId]
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};
