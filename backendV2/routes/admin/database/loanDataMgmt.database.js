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

export const getAllLoans = async () => {
  const [rows] = await pool.query("SELECT * FROM loans");
  return { success: true, data: rows };
};

export const deleteLoanById = async (loanId) => {
  const [result] = await pool.query("DELETE FROM loans WHERE id = ?", [loanId]);
  if (result.affectedRows > 0) return { success: true };
  return { success: false };
};
