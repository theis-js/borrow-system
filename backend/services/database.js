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
