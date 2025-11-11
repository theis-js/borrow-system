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

export const getAllApiKeys = async () => {
  const [rows] = await pool.query("SELECT * FROM apiKeys");
  if (rows.length > 0) {
    return { success: true, data: rows };
  }
  return { success: false };
};

export const createAPIentry = async (apiKey, entryName) => {
  const [result] = await pool.query(
    "INSERT INTO apiKeys (api_key, entry_name) VALUES (?, ?)",
    [apiKey, entryName]
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};

export const deleteAPKey = async (apiKeyId) => {
  const [result] = await pool.query("DELETE FROM apiKeys WHERE id = ?", [
    apiKeyId,
  ]);
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};
