import express from "express";
import { authenticate, generateToken } from "../../services/authentication.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// database funcs import
import { loginFunc, changePassword } from "./database/userMgmt.database.js";
import { sendMail } from "./services/mailer_v2.js";

router.post("/login", async (req, res) => {
  const result = await loginFunc(req.body.username, req.body.password);
  if (result.success) {
    const token = await generateToken({
      username: result.data.username,
      is_admin: result.data.is_admin,
      first_name: result.data.first_name,
      last_name: result.data.last_name,
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

router.post("/contact", authenticate, async (req, res) => {
  const message = req.body.message;
  const username = req.user.username;

  sendMail(username, message);

  res.status(200).json({ message: "Contact message sent successfully" });
});

export default router;
