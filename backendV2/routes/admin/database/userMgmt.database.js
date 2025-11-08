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

export const loginAdmin = async (username, password) => {
  const [rows] = await pool.query(
    "SELECT id, username, first_name, last_name, role, is_admin FROM users WHERE username = ? AND password = ?",
    [username, password]
  );

  if (rows.length === 0) {
    return { success: false, reason: "invalid_credentials" };
  }

  const user = rows[0];
  if (!user.is_admin) {
    return { success: false, reason: "not_admin" };
  }

  return { success: true, data: user };
};
