import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.DB_HOST_2,
    user: process.env.DB_USER_2,
    password: process.env.DB_PASSWORD_2,
    database: process.env.DB_NAME_2,
  })
  .promise();

export const verifyAPIKeyDB = async (apiKey) => {
  const [result] = await pool.query(
    "SELECT * FROM apiKeys WHERE api_key = ?;",
    [apiKey]
  );
  if (result.length > 0) {
    return { valid: true };
  } else {
    return { valid: false };
  }
};
