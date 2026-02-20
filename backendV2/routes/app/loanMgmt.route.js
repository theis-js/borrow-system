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
  getBorrowableItemsFromDatabase,
  getALLLoans,
  getItems,
  SETdeleteLoanFromDatabase,
  setReturnDate,
  setTakeDate,
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
      itemIds,
    );

    if (result.success) {
      const mailInfo = await getLoanInfoWithID(result.data.id);
      console.log(mailInfo);
      sendMailLoan(
        mailInfo.data.username,
        mailInfo.data.loaned_items_name,
        mailInfo.data.start_date,
        mailInfo.data.end_date,
        mailInfo.data.created_at,
        mailInfo.data.note,
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
  } else if (result.status) {
    res.status(200).json([]);
  } else {
    res.status(500).json({ message: "Failed to fetch loans" });
  }
});

router.post("/set-return-date/:loan_code", authenticate, async (req, res) => {
  const loanCode = req.params.loan_code;
  const result = await setReturnDate(loanCode);
  if (result.success) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(500).json({ message: "Failed to set return date" });
  }
});

router.post("/set-take-date/:loan_code", authenticate, async (req, res) => {
  const loanCode = req.params.loan_code;
  const result = await setTakeDate(loanCode);
  if (result.success) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(500).json({ message: "Failed to set take date" });
  }
});

router.get("/all-items", authenticate, async (req, res) => {
  const result = await getItems();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

router.delete("/delete-loan/:id", authenticate, async (req, res) => {
  const loanId = req.params.id;
  const result = await SETdeleteLoanFromDatabase(loanId);
  if (result.success) {
    res.status(200).json({ message: "Loan deleted successfully" });
  } else {
    res.status(500).json({ message: "Failed to delete loan" });
  }
});

router.get("/all-loans", authenticate, async (req, res) => {
  const result = await getALLLoans();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: "Failed to fetch loans" });
  }
});

router.post("/borrowable-items", authenticate, async (req, res) => {
  const { startDate, endDate } = req.body || {};
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "startDate and endDate are required" });
  }

  const result = await getBorrowableItemsFromDatabase(
    startDate,
    endDate,
    req.user.role,
  );
  if (result.success) {
    // return the array directly for consistency with /items
    return res.status(200).json(result.data);
  } else {
    return res
      .status(500)
      .json({ message: "Failed to fetch borrowable items" });
  }
});

export default router;
