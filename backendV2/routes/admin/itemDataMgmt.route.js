import express from "express";
import { authenticateAdmin } from "../../services/authentication.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// database funcs import
import {
  editItemById,
  getAllItems,
  deleteItemById,
  createItem,
  changeSafeState,
} from "./database/itemDataMgmt.database.js";

router.get("/all-items", authenticateAdmin, async (req, res) => {
  const result = await getAllItems();
  if (result.success) {
    return res.status(200).json(result.data);
  }
  return res.status(500).json({ message: "Failed to retrieve items" });
});

router.delete("/delete-item/:id", authenticateAdmin, async (req, res) => {
  const itemId = req.params.id;
  const result = await deleteItemById(itemId);
  if (result.success) {
    return res.status(200).json({ message: "Item deleted successfully" });
  }
  return res.status(500).json({ message: "Failed to delete item" });
});

router.post("/create-item", authenticateAdmin, async (req, res) => {
  const { item_name, can_borrow_role, lockerNumber } = req.body;
  const result = await createItem(item_name, can_borrow_role, lockerNumber);
  if (result.success) {
    return res.status(201).json({ message: "Item created successfully" });
  }
  return res.status(500).json({ message: "Failed to create item" });
});

router.post("/edit-item/:id", authenticateAdmin, async (req, res) => {
  const itemId = req.params.id;
  const { item_name, can_borrow_role } = req.body;
  const result = await editItemById(
    itemId,
    item_name,
    can_borrow_role
  );
  if (result.success) {
    return res.status(200).json({ message: "Item edited successfully" });
  }
  return res.status(500).json({ message: "Failed to edit item" });
});

router.post("/change-safe-state/:id", authenticateAdmin, async (req, res) => {
  const itemId = req.params.id;
  const result = await changeSafeState(itemId);
  if (result.success) {
    return res.status(200).json({ message: "Safe state changed successfully" });
  }
  return res.status(500).json({ message: "Failed to change safe state" });
});

export default router;
