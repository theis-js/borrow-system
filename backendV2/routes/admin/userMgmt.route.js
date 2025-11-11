import express from "express";
import {
  generateToken,
  authenticateAdmin,
} from "../../services/authentication.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// database funcs import
import { loginAdmin } from "./database/userMgmt.database.js";

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  const result = await loginAdmin(username, password);

  if (result.success) {
    const token = await generateToken({
      username: result.data.username,
      first_name: result.data.first_name,
      last_name: result.data.last_name,
      admin: result.data.is_admin,
    });
    return res.status(200).json({
      message: "Login erfolgreich",
      token,
      first_name: result.data.first_name,
    });
  }

  if (result.reason === "not_admin") {
    return res.status(403).json({ message: "Du bist kein Admin" });
  }

  return res.status(401).json({ message: "Ungültige Anmeldedaten" });
});

router.get("/verify-token", authenticateAdmin, async (req, res) => {
  return res.status(200).json({ message: "Token is valid" });
});

export default router;
