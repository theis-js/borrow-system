import express from "express";
import dotenv from "dotenv";
import { getItemsFromDatabaseV2 } from "../services/database.js";

dotenv.config();
const router = express.Router();

router.get("/items/:id", async (req, res) => {
  if (req.params.id === process.env.ADMIN_ID) {
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

export default router;
