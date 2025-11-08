import express from "express";
import { authenticateAdmin } from "../../services/authentication.js";
const router = express.Router();
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// database funcs import
import {
  createUser,
  deleteUserById,
  editUserById,
  changePassword,
  getAllUsers,
  getUserById,
} from "./database/userDataMgmt.database.js";

router.post("/create-user", authenticateAdmin, async (req, res) => {
  const username = req.body.username;
  const role = req.body.role;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;
  const email = req.body.email;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const result = await createUser(
    username,
    role,
    password,
    isAdmin,
    email,
    first_name,
    last_name
  );
  if (result.success) {
    return res.status(201).json({ message: "User created successfully" });
  }
  return res.status(500).json({ message: "Failed to create user" });
});

router.delete("/delete-user/:id", authenticateAdmin, async (req, res) => {
  const userId = req.params.id;
  const result = await deleteUserById(userId);
  if (result.success) {
    return res.status(200).json({ message: "User deleted successfully" });
  }
  return res.status(500).json({ message: "Failed to delete user" });
});

router.post("/edit-user/:id", authenticateAdmin, async (req, res) => {
  const password = req.body.password;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const role = req.body.role;
  const email = req.body.email;
  const userId = req.params.id;
  const is_admin = req.body.is_admin;

  const result = await editUserById(
    userId,
    password,
    first_name,
    last_name,
    role,
    email,
    is_admin
  );

  if (result.success) {
    return res.status(200).json({ message: "User edited successfully" });
  }
  return res.status(500).json({ message: "Failed to edit user" });
});

router.post("/change-password", authenticateAdmin, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const result = await changePassword(username, password);

  if (result.success) {
    return res.status(200).json({ message: "Password reset successfully" });
  }
  return res.status(500).json({ message: "Failed to reset password" });
});

router.post("/edit-user/:id", authenticateAdmin, async (req, res) => {
  const userId = req.params.id;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const role = req.body.role;
  const email = req.body.email;
  const is_admin = req.body.is_admin;

  const result = await editUserById(
    userId,
    first_name,
    last_name,
    role,
    email,
    is_admin
  );

  if (result.success) {
    return res.status(200).json({ message: "User edited successfully" });
  }
  return res.status(500).json({ message: "Failed to edit user" });
});

router.get("/users", authenticateAdmin, async (req, res) => {
  const result = await getAllUsers();
  if (result.success) {
    return res.status(200).json({ users: result.data });
  }
  return res.status(500).json({ message: "Failed to retrieve users" });
});

router.get("/user/:id", authenticateAdmin, async (req, res) => {
  const result = await getUserById(req.params.id);
  if (result.success) {
    return res.status(200).json({ user: result.data });
  }
  return res.status(500).json({ message: "Failed to retrieve user" });
});

export default router;
