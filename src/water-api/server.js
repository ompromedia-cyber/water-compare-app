const express = require("express");
const cors = require("cors");
const watersRouter = require("./routes/waters");
const authRouter = require("./routes/auth");

const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));

app.use("/api/waters", watersRouter);
app.use("/api/auth", authRouter);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Water Expert API listening on ${port}`));
