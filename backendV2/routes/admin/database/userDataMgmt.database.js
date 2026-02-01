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

export const createUser = async (
  username,
  role,
  password,
  isAdmin,
  email,
  first_name,
  last_name,
) => {
  const [result] = await pool.query(
    "INSERT INTO users (username, role, password, is_admin, email, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [username, role, password, isAdmin, email, first_name, last_name],
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const deleteUserById = async (userId) => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ? AND secret_user = false", [userId]);
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const changePassword = async (username, newPassword) => {
  const [result] = await pool.query(
    "UPDATE users SET password = ?, entry_updated_at = NOW() WHERE username = ? AND secret_user = false",
    [newPassword, username],
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const editUserById = async (
  userId,
  first_name,
  last_name,
  role,
  email,
  is_admin,
) => {
  const [result] = await pool.query(
    "UPDATE users SET  first_name = ?, last_name = ?, role = ?, email = ?, is_admin = ?, entry_updated_at = NOW() WHERE id = ? AND secret_user = false",
    [first_name, last_name, role, email, is_admin, userId],
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const getAllUsers = async () => {
  const [result] = await pool.query(
    "SELECT id, username, first_name, last_name, role, email, is_admin, entry_created_at, entry_updated_at FROM users WHERE secret_user = false",
  );
  if (result.length > 0) return { success: true, data: result };
  return { success: false };
};

export const getUserById = async (userId) => {
  const [rows] = await pool.query(
    "SELECT id, username, first_name, last_name, role, email, is_admin FROM users WHERE id = ? AND secret_user = false",
    [userId],
  );
  if (rows.length === 0) {
    return { success: false };
  }
  return { success: true, data: rows[0] };
};
