import express from "express";
import { authenticateAdmin } from "../../services/authentication.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// database funcs import
import {
  getAllApiKeys,
  createAPIentry,
  deleteAPKey,
} from "./database/apiDataMgmt.database.js";

router.get("/get-api-keys", authenticateAdmin, async (req, res) => {
  const result = await getAllApiKeys();
  if (result.success) {
    return res.status(200).json(result.data);
  }
  return res.status(500).json({ message: "Failed to retrieve API keys" });
});

router.post("/create-api-key", authenticateAdmin, async (req, res) => {
  const apiKey = req.body.apiKey;
  const entryName = req.body.entryName;
  const result = await createAPIentry(apiKey, entryName);
  if (result.success) {
    return res.status(201).json({ message: "API key created successfully" });
  }
  return res.status(500).json({ message: "Failed to create API key" });
});

router.delete("/delete-api-key/:id", authenticateAdmin, async (req, res) => {
  const apiKeyId = req.params.id;
  const result = await deleteAPKey(apiKeyId);
  if (result.success) {
    return res.status(200).json({ message: "API key deleted successfully" });
  }
  return res.status(500).json({ message: "Failed to delete API key" });
});

export default router;
