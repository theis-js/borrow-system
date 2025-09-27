import express from "express";
import dotenv from "dotenv";
import {
  getItemsFromDatabaseV2,
  changeInSafeStateV2,
  setReturnDateV2,
  setTakeDateV2,
  getLoanByCodeV2,
  getAllLoansV2,
  getAPIkey,
} from "../services/database.js";

dotenv.config();
const router = express.Router();

async function validateAPIKey(apiKey) {
  try {
    if (!apiKey) return false;
    const result = await getAPIkey();
    if (!result?.success || !Array.isArray(result.data)) return false;
    return result.data.some((row) => String(row.apiKey) === String(apiKey));
  } catch (err) {
    console.error("validateAPIKey error:", err);
    return false;
  }
}

// Add a guard that returns Access Denied instead of hanging
const apiKeyGuard = async (req, res, next) => {
  try {
    const key = req.params.key;
    if (!key) {
      return res
        .status(401)
        .json({ message: "Access denied: missing API key" });
    }
    const ok = await validateAPIKey(key);
    if (!ok) {
      return res
        .status(401)
        .json({ message: "Access denied: invalid API key" });
    }
    next();
  } catch (e) {
    console.error("apiKeyGuard error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route for API to get ALL items from the database
router.get("/items/:key", apiKeyGuard, async (req, res) => {
  const result = await getItemsFromDatabaseV2();
  if (result.success) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// Route for API to control the position of an item
router.post(
  "/controlInSafe/:key/:itemId/:state",
  apiKeyGuard,
  async (req, res) => {
    const itemId = req.params.itemId;
    const state = req.params.state;

    if (state === "1" || state === "0") {
      const result = await changeInSafeStateV2(itemId, state);
      if (result.success) {
        res.status(200).json({ data: result.data });
      } else {
        res.status(500).json({ message: "Failed to update item state" });
      }
    } else {
      res.status(400).json({ message: "Invalid state value" });
    }
  }
);

// Route for API to get a loan by its code
router.get("/getLoanByCode/:key/:loan_code", apiKeyGuard, async (req, res) => {
  const loan_code = req.params.loan_code;
  const result = await getLoanByCodeV2(loan_code);
  if (result.success) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(404).json({ message: "Loan not found" });
  }
});

// Route for API to set the return date by the loan code
router.post("/setReturnDate/:key/:loan_code", apiKeyGuard, async (req, res) => {
  const loanCode = req.params.loan_code;
  const result = await setReturnDateV2(loanCode);
  if (result.success) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(500).json({ message: "Failed to set return date" });
  }
});

// Route for API to set the take away date by the loan code
router.post("/setTakeDate/:key/:loan_code", apiKeyGuard, async (req, res) => {
  const loanCode = req.params.loan_code;
  const result = await setTakeDateV2(loanCode);
  if (result.success) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(500).json({ message: "Failed to set take date" });
  }
});

// Route for API to get ALL loans from the database without sensitive info (only for landingpage)
router.get("/allLoans", async (req, res) => {
  const result = await getAllLoansV2();
  if (result.success) {
    return res.status(200).json(result.data);
  }
  return res.status(500).json({ message: "Failed to fetch loans" });
});

// Route for API to get ALL items from the database (only for landingpage)
router.get("/allItems", async (req, res) => {
  const result = await getItemsFromDatabaseV2();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

export default router;
