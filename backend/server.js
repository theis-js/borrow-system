import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import info from "./info.json" with { type: "json" };
import { authenticate } from "./services/authentication.js";
import { rateLimit } from "express-rate-limit";

dotenv.config();
const app = express();
const port = 8004;
const naasURL = process.env.NAAS_URL;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 50, // Limit each IP to 50 requests per `window` (here, per 1 minute).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

app.use(limiter);

// frontend routes
import loansMgmtRouter from "./routes/app/loanMgmt.route.js";
import userMgmtRouterAPP from "./routes/app/userMgmt.route.js";

// admin routes
import userDataMgmtRouter from "./routes/admin/userDataMgmt.route.js";
import loanDataMgmtRouter from "./routes/admin/loanDataMgmt.route.js";
import itemDataMgmtRouter from "./routes/admin/itemDataMgmt.route.js";
import apiDataMgmtRouter from "./routes/admin/apiDataMgmt.route.js";
import userMgmtRouterADMIN from "./routes/admin/userMgmt.route.js";
import serverConfMgmtRouter from "./routes/admin/serverConfMgmt.route.js";

// API routes
import apiRouter from "./routes/api/api.route.js";

app.use(cors());
// Body-Parser VOR den Routen registrieren
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// frontend routes
app.use("/api/loans", loansMgmtRouter);
app.use("/api/users", userMgmtRouterAPP);

// admin routes
app.use("/api/admin/loan-data", loanDataMgmtRouter);
app.use("/api/admin/user-data", userDataMgmtRouter);
app.use("/api/admin/item-data", itemDataMgmtRouter);
app.use("/api/admin/api-data", apiDataMgmtRouter);
app.use("/api/admin/user-mgmt", userMgmtRouterADMIN);
app.use("/api/admin/server-config", serverConfMgmtRouter);

// API routes
app.use("/api", apiRouter);

app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.get("/no", async (req, res) => {
  try {
    const response = await fetch(naasURL);
    if (!response.ok) {
      res.status(500).send("Request to no-as-a-service went wrong.");
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error communicating with no-as-a-service:", error);
    res.status(500).send("Error communicating with no-as-a-service.");
  }
});

app.get("/verify", authenticate, async (req, res) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
});

app.get("/", (req, res) => {
  res.send(info);
});

// error handling code
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
