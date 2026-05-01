import express from "express";
import { authenticateAdmin } from "../../services/authentication.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// database funcs import
import {
  getAllFunctions,
  updateFunctionStatus,
} from "./database/serverConfMgmt.database.js";

// Route to get all functions and their statuses
router.get("/all", async (req, res) => {
  try {
    const result = await getAllFunctions();
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(500).json({ message: "Failed to fetch functions" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// Route to update the status of a function
router.post("/update", async (req, res) => {
  const functionName = req.query.functionName;
  let active = req.query.active;

  if (active === "false") {
    active = 0;
  } else if (active === "true") {
    active = 1;
  } else {
    res.status(406).json({ message: "Got unexpected format" });
  }

  const result = await updateFunctionStatus(functionName, active);
  if (result.success) {
    res.status(200).json({ message: "Function status updated successfully" });
  } else {
    res.status(500).json({ message: "Failed to update function status" });
  }
});

export default router;
