import express from "express";
import cors from "cors";
import env from "dotenv";
import loansMgmtRouter from "./routes/app/loanMgmt.route.js";
import userMgmtRouter from "./routes/app/userMgmt.route.js";
env.config();
const app = express();
const port = 8002;

app.use(cors());
app.use("/api/loans", loansMgmtRouter);
app.use("/api/users", userMgmtRouter);
// Increase body size limits to support large CSV JSON payloads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.set("view engine", "ejs");
app.use(express.json({ limit: "10mb" }));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
// error handling code
app.use((err, req, res, next) => {
  // Log the error stack and send a generic error response
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
