import express from "express";
import { authenticate, generateToken } from "../../services/authentication.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// database funcs import
import {
  createLoanInDatabase,
  getLoanInfoWithID,
  getLoansFromDatabase,
} from "./database/loansMgmt.database.js";
import { sendMailLoan } from "./services/mailer.js";

router.post("/createLoan", authenticate, async (req, res) => {
  try {
    const { items, startDate, endDate, note } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required" });
    }

    // If dates are not provided, default to now .. +7 days
    const start =
      startDate ?? new Date().toISOString().slice(0, 19).replace("T", " ");
    const end =
      endDate ??
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

    // Coerce item IDs to numbers and filter invalids
    const itemIds = items
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n));

    if (itemIds.length === 0) {
      return res.status(400).json({ message: "No valid item IDs provided" });
    }

    const result = await createLoanInDatabase(
      req.user.username,
      start,
      end,
      note,
      itemIds
    );

    if (result.success) {
      const mailInfo = await getLoanInfoWithID(result.data.id);
      console.log(mailInfo);
      sendMailLoan(
        mailInfo.data.username,
        mailInfo.data.loaned_items_name,
        mailInfo.data.start_date,
        mailInfo.data.end_date,
        mailInfo.data.created_at
      );
      return res.status(201).json({
        message: "Loan created successfully",
        loanId: result.data.id,
        loanCode: result.data.loan_code,
      });
    }

    if (result.code === "CONFLICT") {
      return res
        .status(409)
        .json({ message: "Items not available in the selected period" });
    }

    if (result.code === "BAD_REQUEST") {
      return res.status(400).json({ message: result.message });
    }

    return res.status(500).json({ message: "Failed to create loan" });
  } catch (err) {
    console.error("createLoan error:", err);
    return res.status(500).json({ message: "Failed to create loan" });
  }
});

router.get("/loans", authenticate, async (req, res) => {
  const result = await getLoansFromDatabase(req.user.username);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: "Failed to fetch loans" });
  }
});

export default router;
