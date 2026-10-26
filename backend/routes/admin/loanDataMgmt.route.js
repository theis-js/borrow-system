import express from "express";
import { authenticateAdmin } from "../../services/authentication.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// database funcs import
import {
  deleteLoanById,
  getAllLoans,
} from "./database/loanDataMgmt.database.js";

router.get("/all-loans", authenticateAdmin, async (req, res) => {
  const result = await getAllLoans();
  if (result.success) {
    return res.status(200).json(result.data);
  }
  return res.status(500).json({ message: "Failed to retrieve loans" });
});

router.delete("/delete-loan/:id", authenticateAdmin, async (req, res) => {
  const loanId = req.params.id;
  const result = await deleteLoanById(loanId);
  if (result.success) {
    return res.status(200).json({ message: "Loan deleted successfully" });
  }
  return res.status(500).json({ message: "Failed to delete loan" });
});

export default router;
