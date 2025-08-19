import express from "express";
import dotenv from "dotenv";
import {
  getItemsFromDatabaseV2,
  changeInSafeStateV2,
} from "../services/database.js";

dotenv.config();
const router = express.Router();

router.get("/items/:key", async (req, res) => {
  if (req.params.key === process.env.ADMIN_ID) {
    const result = await getItemsFromDatabaseV2();
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  } else {
    res.status(403).json({ message: "Access denied" });
  }
});

router.post("/controlInSafe/:key/:itemId/:state", async (req, res) => {
  if (req.params.key === process.env.ADMIN_ID) {
    const itemId = req.params.itemId;
    const state = req.params.state;
    if (state === "1" || state === "0") {
      const result = await changeInSafeStateV2(itemId, state);
      if (result.success) {
        res.status(200).json({ message: "Item state updated successfully" });
      } else {
        res.status(500).json({ message: "Failed to update item state" });
      }
    } else {
      res.status(400).json({ message: "Invalid state value" });
    }
  } else {
    res.status(403).json({ message: "Access denied" });
  }
});

export default router;
