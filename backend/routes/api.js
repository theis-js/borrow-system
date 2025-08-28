import express from "express";
import {
  loginFunc,
  getItemsFromDatabase,
  getLoansFromDatabase,
  getUserLoansFromDatabase,
  deleteLoanFromDatabase,
  getBorrowableItemsFromDatabase,
  createLoanInDatabase,
  onTake,
  onReturn,
} from "../services/database.js";
import { authenticate, generateToken } from "../services/tokenService.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  const result = await loginFunc(req.body.username, req.body.password);
  if (result.success) {
    const token = await generateToken({
      username: result.data.username,
      role: result.data.role,
    });
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.get("/items", authenticate, async (req, res) => {
  console.log(req);
  const result = await getItemsFromDatabase(req.user.role);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

router.get("/loans", authenticate, async (req, res) => {
  const result = await getLoansFromDatabase();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: "Failed to fetch loans" });
  }
});

router.get("/userLoans", authenticate, async (req, res) => {
  const result = await getUserLoansFromDatabase(req.user.username);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: "Failed to fetch user loans" });
  }
});

router.delete("/deleteLoan/:id", authenticate, async (req, res) => {
  const loanId = req.params.id;
  const result = await deleteLoanFromDatabase(loanId);
  if (result.success) {
    res.status(200).json({ message: "Loan deleted successfully" });
  } else {
    res.status(500).json({ message: "Failed to delete loan" });
  }
});

router.post("/borrowableItems", authenticate, async (req, res) => {
  const { startDate, endDate } = req.body || {};
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "startDate and endDate are required" });
  }

  const result = await getBorrowableItemsFromDatabase(
    startDate,
    endDate,
    req.user.role
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

router.post("/takeLoan/:id", authenticate, async (req, res) => {
  const loanId = req.params.id;
  const result = await onTake(loanId);
  if (result.success) {
    res.status(200).json({ message: "Loan taken successfully" });
  } else {
    res.status(500).json({ message: "Failed to take loan" });
  }
});

router.post("/returnLoan/:id", authenticate, async (req, res) => {
  const loanId = req.params.id;
  const result = await onReturn(loanId);
  if (result.success) {
    res.status(200).json({ message: "Loan returned successfully" });
  } else {
    res.status(500).json({ message: "Failed to return loan" });
  }
});

router.post("/createLoan", authenticate, async (req, res) => {
  try {
    const { items, startDate, endDate } = req.body || {};

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
      itemIds
    );

    if (result.success) {
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

export default router;
