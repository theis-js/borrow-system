import express from "express";
import { authenticate, generateToken } from "../../services/authentication.js";
import { checkIfServiceIsActive } from "../../services/functions.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

const user_frontend_service = "User Frontend";
const contact_form_service = "Contact Form Service";

// database funcs import
import {
  loginFunc,
  changePassword,
  getDeactivatedServices,
} from "./database/userMgmt.database.js";

// mailer imports
import { sendMail } from "../../services/mailer/send.js";
import { contactMail } from "../../services/mailer/templates/contact.js";

router.post(
  "/login",
  checkIfServiceIsActive(user_frontend_service),
  async (req, res) => {
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
  },
);

router.post(
  "/change-password",
  checkIfServiceIsActive(user_frontend_service),
  authenticate,
  async (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const username = req.user.username;
    const result = await changePassword(username, oldPassword, newPassword);
    if (result.success) {
      res.status(200).json({ message: "Password changed successfully" });
    } else {
      res.status(500).json({ message: "Failed to change password" });
    }
  },
);

router.post(
  "/contact",
  checkIfServiceIsActive(contact_form_service),
  authenticate,
  async (req, res) => {
    try {
      const message = req.body?.message;
      const username = req.user?.first_name + " " + req.user?.last_name;

      if (!username || !message) {
        return res
          .status(400)
          .json({ message: "Username and message are required" });
      }

      const { html, text } = contactMail({ username, message });
      await sendMail({
        to: process.env.MAIL_SENDEES_CONTACT,
        subject: "Neue Nachricht!",
        html,
        text,
      });

      res.status(200).json({ message: "Contact message sent successfully" });
    } catch (error) {
      console.error("Failed to send contact mail:", error);
      res.status(500).json({ message: "Failed to send contact message" });
    }
  },
);

router.get("/deactivated-services", authenticate, async (req, res) => {
  const result = await getDeactivatedServices();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: "Failed to fetch deactivated services" });
  }
});

export default router;
