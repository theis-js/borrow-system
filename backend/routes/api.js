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
  getAllApiKeys,
  createAPIentry,
  deleteAPKey,
  getLoanInfoWithID,
} from "../services/database.js";
import { authenticate, generateToken } from "../services/tokenService.js";
const router = express.Router();
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Nice HTML + text templates for the loan email
function buildLoanEmail({ user, items, startDate, endDate, createdDate }) {
  const brand = process.env.MAIL_BRAND_COLOR || "#0ea5e9";
  const itemsList =
    Array.isArray(items) && items.length
      ? `<ul style="margin:8px 0 0 16px; padding:0;">${items
          .map((i) => `<li style="margin:4px 0; color:#111827;">${i}</li>`)
          .join("")}</ul>`
      : "<span style='color:#111827;'>N/A</span>";

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <meta name="x-apple-disable-message-reformatting">
    <style>
      :root {
        color-scheme: light;
        supported-color-schemes: light;
      }
      /* Sicherheitsnetz für Clients, die Dark-Mode forcieren */
      @media (prefers-color-scheme: dark) {
        body, table, td, p, a, h1, h2, h3, h4, h5, h6 {
          background: #ffffff !important;
          color: #111827 !important;
        }
        .brand-header {
          background: ${brand} !important;
          color: #ffffff !important;
        }
        a { color: ${brand} !important; }
      }
    </style>
  </head>
  <body bgcolor="#ffffff" style="margin:0; padding:0; background:#ffffff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; color:#111827; -webkit-text-size-adjust:100%;">
    <div role="article" aria-roledescription="email" lang="de" style="padding:24px; background:#f2f4f7;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
        <tr>
          <td class="brand-header" style="padding:20px 24px; background:${brand}; color:#ffffff;">
            <h1 style="margin:0; font-size:18px; line-height:1.3; font-weight:600;">Neue Ausleihe erstellt</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px; color:#111827;">
            <p style="margin:0 0 12px 0; color:#111827;">Es wurde eine neue Ausleihe angelegt. Hier sind die Details:</p>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0; color:#6b7280; width:180px;">Benutzer</td>
                <td style="padding:8px 0; font-weight:600; color:#111827;">${
                  user || "N/A"
                }</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#6b7280; vertical-align:top;">Ausgeliehene Gegenstände</td>
                <td style="padding:8px 0; font-weight:600; color:#111827;">${itemsList}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#6b7280;">Startdatum</td>
                <td style="padding:8px 0; font-weight:600; color:#111827;">${formatDateTime(
                  startDate
                )}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#6b7280;">Enddatum</td>
                <td style="padding:8px 0; font-weight:600; color:#111827;">${formatDateTime(
                  endDate
                )}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#6b7280;">Erstellt am</td>
                <td style="padding:8px 0; font-weight:600; color:#111827;">${formatDateTime(
                  createdDate
                )}</td>
              </tr>
            </table>
            <p style="margin:20px 0 0 0; font-size:14px; color:#111827;">
              <a href="https://admin.insta.the1s.de/api" style="color:${brand}; text-decoration:underline;" target="_blank" rel="noopener noreferrer">
                Zur Übersicht aller Ausleihen
              </a>
            </p>
            <p style="margin:16px 0 0 0; font-size:12px; color:#6b7280;">Diese E-Mail wurde automatisch vom Ausleihsystem gesendet. Bitte nicht antworten.</p>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
}

function buildLoanEmailText({ user, items, startDate, endDate, createdDate }) {
  const itemsText =
    Array.isArray(items) && items.length ? items.join(", ") : "N/A";
  return [
    "Neue Ausleihe erstellt",
    "",
    `Benutzer: ${user || "N/A"}`,
    `Gegenstände: ${itemsText}`,
    `Start: ${formatDateTime(startDate)}`,
    `Ende: ${formatDateTime(endDate)}`,
    `Erstellt am: ${formatDateTime(createdDate)}`,
  ].join("\n");
}

function sendMailLoan(user, items, startDate, endDate, createdDate) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  (async () => {
    const info = await transporter.sendMail({
      from: '"Ausleihsystem" <noreply@mcs-medien.de>',
      to: process.env.MAIL_SENDEES,
      subject: "Eine neue Ausleihe wurde erstellt!",
      text: buildLoanEmailText({
        user,
        items,
        startDate,
        endDate,
        createdDate,
      }),
      html: buildLoanEmail({ user, items, startDate, endDate, createdDate }),
    });

    console.log("Message sent:", info.messageId);
  })();
  console.log("sendMailLoan called");
}

const formatDateTime = (value) => {
  if (value == null) return "N/A";

  const toOut = (d) => {
    if (!(d instanceof Date) || isNaN(d.getTime())) return "N/A";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}.${mm}.${yyyy} ${hh}:${mi} Uhr`;
  };

  if (value instanceof Date) return toOut(value);
  if (typeof value === "number") return toOut(new Date(value));

  const s = String(value).trim();

  // Direct pattern: "YYYY-MM-DD[ T]HH:mm[:ss]"
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::\d{2})?/);
  if (m) {
    const [, y, M, d, h, min] = m;
    return `${d}.${M}.${y} ${h}:${min} Uhr`;
  }

  // ISO or other parseable formats
  const dObj = new Date(s);
  if (!isNaN(dObj.getTime())) return toOut(dObj);

  return "N/A";
};

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

router.get("/apiKeys", authenticate, async (req, res) => {
  const result = await getAllApiKeys();
  if (result.success) {
    return res.status(200).json(result.data);
  }
  return res.status(500).json({ message: "Failed to fetch API keys" });
});

router.delete("/deleteAPKey/:id", authenticate, async (req, res) => {
  const apiKeyId = req.params.id;
  const result = await deleteAPKey(apiKeyId);
  if (result.success) {
    return res.status(200).json({ message: "API key deleted successfully" });
  }
  return res.status(500).json({ message: "Failed to delete API key" });
});

router.post("/createAPIentry", authenticate, async (req, res) => {
  const apiKey = req.body.apiKey;
  const user = req.body.user;
  if (!apiKey || !user) {
    return res.status(400).json({ message: "API key and user are required" });
  }

  // Ensure apiKey is a number
  const apiKeyNum = Number(apiKey);
  if (!Number.isFinite(apiKeyNum)) {
    return res.status(400).json({ message: "API key must be a number" });
  }

  const result = await createAPIentry(apiKeyNum, user);
  if (result.success) {
    return res.status(201).json({ message: "API key created successfully" });
  }
  if (result.code === "DUPLICATE") {
    return res.status(409).json({ message: "API key already exists" });
  }
  return res.status(500).json({ message: "Failed to create API key" });
});

router.get("/apiKeys/validate/:key", async (req, res) => {
  try {
    const rawKey = req.params.key;
    const result = await getAllApiKeys();
    if (!result.success || !Array.isArray(result.data)) {
      return res.status(500).json({ valid: false });
    }

    const isValid = result.data.some((entry) => {
      const val = String(
        entry?.key ?? entry?.apiKey ?? entry?.api_key ?? entry
      );
      return val === String(rawKey);
    });

    return res.status(200).json({ valid: isValid });
  } catch (err) {
    console.error("validate api key error:", err);
    return res.status(500).json({ valid: false });
  }
});

export default router;
