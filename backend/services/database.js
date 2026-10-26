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

export const verifyAPIKeyDB = async (apiKey) => {
  const [result] = await pool.query(
    "SELECT * FROM apiKeys WHERE api_key = ?;",
    [apiKey]
  );
  if (result.length > 0) {
    const [lastUsed] = await pool.query(
      "UPDATE apiKeys SET last_used_at = NOW() WHERE api_key = ?;",
      [apiKey]
    );
    if (lastUsed.affectedRows > 0) {
      return { valid: true };
    } else {
      return { valid: false };
    }
  } else {
    return { valid: false };
  }
};
