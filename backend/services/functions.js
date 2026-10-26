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

export function checkIfServiceIsActive(service) {
  return async (req, res, next) => {
    const [result] = await pool.query(
      "SELECT * FROM functions WHERE function_name = ? AND active = 1;",
      [service],
    );

    if (result.length > 0) {
      return next();
    }

    return res
      .status(503)
      .json({ message: `-${service}- is currently unavailable.` });
  };
}

export async function checkIfServiceIsActive2(service) {
  const [result] = await pool.query(
    "SELECT * FROM functions WHERE function_name = ? AND active = 1;",
    [service],
  );

  if (result.length > 0) {
    return true;
  }

  return false;
}
