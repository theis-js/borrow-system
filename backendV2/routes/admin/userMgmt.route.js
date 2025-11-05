import express from "express";
import { authenticate, generateToken } from "../services/tokenService.js";
const router = express.Router();
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// database funcs import
import { loginFunc } from "./database/userMgmt.database.js";

router.post("/login", async (req, res) => {
  const result = await loginFunc(req.body.username, req.body.password);

  if (result.success) {
    const token = await generateToken({
      username: result.data.username,
      first_name: result.data.first_name,
      last_name: result.data.last_name,
      role: result.data.role,
    });
    return res.status(200).json({ message: "Login erfolgreich", token });
  }

  if (result.reason === "not_admin") {
    return res.status(403).json({ message: "Du bist kein Admin" });
  }

  return res.status(401).json({ message: "Ungültige Anmeldedaten" });
});
