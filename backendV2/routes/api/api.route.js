import express from "express";
import { authenticate } from "../../services/authentication.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

import {
  getItemsFromDatabaseV2,
  changeInSafeStateV2,
  setTakeDateV2,
  setReturnDateV2,
  getLoanByCodeV2,
} from "./api.database.js";

// Route for API to get all items from the database
router.get("/items/:key", authenticate, async (req, res) => {
  const result = await getItemsFromDatabaseV2();
  if (result.success) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// Route for API to control the safe state of an item
router.post(
  "/change-state/:key/:itemId/:state",
  authenticate,
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
router.get(
  "/get-loan-by-code/:key/:loan_code",
  authenticate,
  async (req, res) => {
    const loan_code = req.params.loan_code;
    const result = await getLoanByCodeV2(loan_code);
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  }
);

// Route for API to set the return date by the loan code
router.post(
  "/set-return-date/:key/:loan_code",
  authenticate,
  async (req, res) => {
    const loanCode = req.params.loan_code;
    const result = await setReturnDateV2(loanCode);
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(500).json({ message: "Failed to set return date" });
    }
  }
);

// Route for API to set the take away date by the loan code
router.post(
  "/set-take-date/:key/:loan_code",
  authenticate,
  async (req, res) => {
    const loanCode = req.params.loan_code;
    const result = await setTakeDateV2(loanCode);
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(500).json({ message: "Failed to set take date" });
    }
  }
);

export default router;
