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

export const getAllFunctions = async () => {
  const [rows] = await pool.query("SELECT * FROM functions");
  return { success: true, data: rows };
};

export const updateFunctionStatus = async (functionName, active) => {
  const [result] = await pool.query(
    "UPDATE functions SET active = ? WHERE function_name = ?",
    [active, functionName],
  );
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};
