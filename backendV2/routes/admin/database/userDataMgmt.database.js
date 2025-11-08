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
  last_name
) => {
  const [result] = await pool.query(
    "INSERT INTO users (username, role, password, is_admin, email, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [username, role, password, isAdmin, email, first_name, last_name]
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const deleteUserById = async (userId) => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const changePassword = async (userId, newPassword) => {
  const [result] = await pool.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [newPassword, userId]
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
  is_admin
) => {
  const [result] = await pool.query(
    "UPDATE users SET  first_name = ?, last_name = ?, role = ?, email = ?, is_admin = ? WHERE id = ?",
    [first_name, last_name, role, email, is_admin, userId]
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const getAllUsers = async () => {
  const [result] = await pool.query(
    "SELECT id, username, first_name, last_name, role, email, is_admin FROM users"
  );
  if (result.length > 0) return { success: true, data: result };
  return { success: false };
};

export const getUserById = async (userId) => {
  const [rows] = await pool.query(
    "SELECT id, username, first_name, last_name, role, email, is_admin FROM users WHERE id = ?",
    [userId]
  );
  if (rows.length === 0) {
    return { success: false };
  }
  return { success: true, data: rows[0] };
};
