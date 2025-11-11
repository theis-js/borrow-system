import express from "express";
import cors from "cors";
import env from "dotenv";
import info from "./info.json" assert { type: "json" };

// frontend routes
import loansMgmtRouter from "./routes/app/loanMgmt.route.js";
import userMgmtRouterAPP from "./routes/app/userMgmt.route.js";

// admin routes
import userDataMgmtRouter from "./routes/admin/userDataMgmt.route.js";
import loanDataMgmtRouter from "./routes/admin/loanDataMgmt.route.js";
import itemDataMgmtRouter from "./routes/admin/itemDataMgmt.route.js";
import apiDataMgmtRouter from "./routes/admin/apiDataMgmt.route.js";
import userMgmtRouterADMIN from "./routes/admin/userMgmt.route.js";

env.config();
const app = express();
const port = 8004;

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

app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.get("/", (req, res) => {
  res.send(info);
});

// error handling code
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
