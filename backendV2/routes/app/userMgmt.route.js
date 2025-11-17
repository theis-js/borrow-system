import express from "express";
import { authenticate, generateToken } from "../../services/authentication.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// database funcs import
import { loginFunc, changePassword } from "./database/userMgmt.database.js";

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

router.post("/change-password", authenticate, async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const username = req.user.username;
  const result = await changePassword(username, oldPassword, newPassword);
  if (result.success) {
    res.status(200).json({ message: "Password changed successfully" });
  } else {
    res.status(500).json({ message: "Failed to change password" });
  }
});

export default router;
