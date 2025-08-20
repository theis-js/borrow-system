import express from "express";
import dotenv from "dotenv";
import {
  getItemsFromDatabaseV2,
  changeInSafeStateV2,
  setReturnDateV2,
  setTakeDateV2,
  getLoanByCodeV2,
} from "../services/database.js";

dotenv.config();
const router = express.Router();

// Route for API to get ALL items from the database
router.get("/items/:key", async (req, res) => {
  if (req.params.key === process.env.ADMIN_ID) {
    const result = await getItemsFromDatabaseV2();
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  } else {
    res.status(403).json({ message: "Access denied" });
  }
});

// Route for API to control the position of an item
router.post("/controlInSafe/:key/:itemId/:state", async (req, res) => {
  if (req.params.key === process.env.ADMIN_ID) {
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
  } else {
    res.status(403).json({ message: "Access denied" });
  }
});

router.get("/getLoanByCode/:key/:loan_code", async (req, res) => {
  if (req.params.key === process.env.ADMIN_ID) {
    const loan_code = req.params.loan_code;

    const result = await getLoanByCodeV2(loan_code);
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  }
});

// Route for API to set the return date
router.post("/setReturnDate/:key/:loan_code", async (req, res) => {
  if (req.params.key === process.env.ADMIN_ID) {
    const loanCode = req.params.loan_code;

    const result = await setReturnDateV2(loanCode);
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(500).json({ message: "Failed to set return date" });
    }
  } else {
    res.status(403).json({ message: "Access denied" });
  }
});

// Route for API to set the take away date
router.post("/setTakeDate/:key/:loan_code", async (req, res) => {
  if (req.params.key === process.env.ADMIN_ID) {
    const loanCode = req.params.loan_code;

    const result = await setTakeDateV2(loanCode);
    if (result.success) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(500).json({ message: "Failed to set take date" });
    }
  } else {
    res.status(403).json({ message: "Access denied" });
  }
});

export default router;
