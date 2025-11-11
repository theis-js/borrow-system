import express from "express";
import { authenticate, generateToken } from "../../services/authentication.js";
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
      role: result.data.role,
    });
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

export default router;
