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
  loginAdmin,
  onReturn,
  getAllUsers,
  deleteUserID,
  handleEdit,
  createUser,
  getAllLoans,
  getAllItems,
  deleteItemID,
  createItem,
  changeUserPassword,
  changeUserPasswordFRONTEND,
  changeInSafeStateV2,
  updateItemByID,
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

router.post("/changePassword", authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  const username = req.user.username;
  const result = await changeUserPasswordFRONTEND(
    username,
    oldPassword,
    newPassword
  );
  if (result.success) {
    res.status(200).json({ message: "Password changed successfully" });
  } else {
    res.status(500).json({ message: "Failed to change password" });
  }
});

// Admin panel functions

router.post("/loginAdmin", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const result = await loginAdmin(username, password);
  if (result.success) {
    const token = await generateToken({
      username: result.data.username,
      role: result.data.role,
    });

    return res.status(200).json({
      message: "Login successful",
      first_name: result.data.first_name,
      token,
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

router.get("/allUsers", authenticate, async (req, res) => {
  const result = await getAllUsers();
  if (result.success) {
    return res.status(200).json(result.data);
  }
  return res.status(500).json({ message: "Failed to fetch users" });
});

router.delete("/deleteUser/:id", authenticate, async (req, res) => {
  const userId = req.params.id;
  const result = await deleteUserID(userId);
  if (result.success) {
    return res.status(200).json({ message: "User deleted successfully" });
  }
  return res.status(500).json({ message: "Failed to delete user" });
});

router.get("/verifyToken", authenticate, async (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

router.post("/editUser/:id", authenticate, async (req, res) => {
  const userId = req.params.id;
  const { username, role } = req.body || {};
  const result = await handleEdit(userId, username, role);
  if (result.success) {
    return res.status(200).json({ message: "User edited successfully" });
  }
  return res.status(500).json({ message: "Failed to edit user" });
});

router.post("/createUser", authenticate, async (req, res) => {
  const { username, role, password } = req.body || {};
  const result = await createUser(username, role, password);
  if (result.success) {
    return res.status(201).json({ message: "User created successfully" });
  }
  return res.status(500).json({ message: "Failed to create user" });
});

router.get("/allLoans", authenticate, async (req, res) => {
  const result = await getAllLoans();
  if (result.success) {
    return res.status(200).json(result.data);
  }
  return res.status(500).json({ message: "Failed to fetch loans" });
});

router.get("/allItems", authenticate, async (req, res) => {
  const result = await getAllItems();
  if (result.success) {
    return res.status(200).json(result.data);
  }
  return res.status(500).json({ message: "Failed to fetch items" });
});

router.delete("/deleteItem/:id", authenticate, async (req, res) => {
  const itemId = req.params.id;
  const result = await deleteItemID(itemId);
  if (result.success) {
    return res.status(200).json({ message: "Item deleted successfully" });
  }
  return res.status(500).json({ message: "Failed to delete item" });
});

router.post("/createItem", authenticate, async (req, res) => {
  const { item_name, can_borrow_role } = req.body || {};
  const result = await createItem(item_name, can_borrow_role);
  if (result.success) {
    return res.status(201).json({ message: "Item created successfully" });
  }
  return res.status(500).json({ message: "Failed to create item" });
});

router.post("/changePWadmin", authenticate, async (req, res) => {
  const newPassword = req.body.newPassword;
  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  const result = await changeUserPassword(req.body.username, newPassword);
  if (result.success) {
    return res.status(200).json({ message: "Password changed successfully" });
  }
  return res.status(500).json({ message: "Failed to change password" });
});

router.post("/updateItemByID", authenticate, async (req, res) => {
  const role = req.body.can_borrow_role;
  const itemId = req.body.itemId;
  const item_name = req.body.item_name;
  const result = await updateItemByID(itemId, item_name, role);
  if (result.success) {
    return res.status(200).json({ message: "Item updated successfully" });
  }
  return res.status(500).json({ message: "Failed to update item" });
});

router.put("/changeSafeState/:itemId", authenticate, async (req, res) => {
  const itemId = req.params.itemId;
  const result = await changeInSafeStateV2(itemId);
  if (result.success) {
    return res
      .status(200)
      .json({ message: "Item safe state updated successfully" });
  }
  return res.status(500).json({ message: "Failed to update item safe state" });
});

export default router;
