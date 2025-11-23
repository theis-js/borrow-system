import express from "express";
import cors from "cors";
import env from "dotenv";
import info from "./info.json" assert { type: "json" };
import { authenticate } from "./services/authentication.js";

// frontend routes
import loansMgmtRouter from "./routes/app/loanMgmt.route.js";
import userMgmtRouterAPP from "./routes/app/userMgmt.route.js";

// admin routes
import userDataMgmtRouter from "./routes/admin/userDataMgmt.route.js";
import loanDataMgmtRouter from "./routes/admin/loanDataMgmt.route.js";
import itemDataMgmtRouter from "./routes/admin/itemDataMgmt.route.js";
import apiDataMgmtRouter from "./routes/admin/apiDataMgmt.route.js";
import userMgmtRouterADMIN from "./routes/admin/userMgmt.route.js";

// API routes
import apiRouter from "./routes/api/api.route.js";

env.config();
const app = express();
const port = 8102;

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

// API routes
app.use("/api", apiRouter);

app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
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
