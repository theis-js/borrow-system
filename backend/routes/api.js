import express from "express";
import { loginFunc, getItemsFromDatabase } from "../services/database.js";
import { authenticate, generateToken } from "../services/tokenService.js";
const router = express.Router();

// Example endpoint
router.post("/login", async (req, res) => {
  const result = await loginFunc(req.body.username, req.body.password);
  if (result.success) {
    const token = await generateToken({ username: req.body.username });
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.get("/items", authenticate, async (req, res) => {
  const result = await getItemsFromDatabase();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

export default router;
