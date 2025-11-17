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

export const getItems = async () => {
  const [rows] = await pool.query("SELECT * FROM items;");
  if (rows.length > 0) {
    return { success: true, data: rows };
  }
  return { success: false };
};

export const getALLLoans = async () => {
  const [rows] = await pool.query("SELECT * FROM loans;");
  if (rows.length > 0) {
    return { success: true, data: rows };
  }
  return { success: false };
};

export const changePassword = async (username, oldPassword, newPassword) => {
  // get user current password
  const [user] = await pool.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, oldPassword]
  );
  if (user.length === 0) return { success: false };

  // update password

  const [result] = await pool.query(
    "UPDATE users SET password = ? WHERE username = ?",
    [newPassword, username]
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};
