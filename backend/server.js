import express from "express";
import cors from "cors";
import env from "dotenv";
env.config();
const app = express();
const port = 8002;

app.use(cors());
// Increase body size limits to support large CSV JSON payloads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.set("view engine", "ejs");
app.use(express.json({ limit: "10mb" }));

// Import API router
import apiRouter from "./routes/api.js";

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// error handling code
app.use((err, req, res, next) => {
  // Log the error stack and send a generic error response
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
