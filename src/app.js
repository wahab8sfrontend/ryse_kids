import express from "express";
import authRoutes from "./routes/auth.routes.js";
import childrenRoutes from "./routes/children.routes.js";
import walletRoutes from "./routes/wallet.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/children", childrenRoutes);
app.use("/api/wallet", walletRoutes);

export default app;
