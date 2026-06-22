import express from "express";

import { registerParentController } from "./controllers/auth.controller.js";

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(express.json());

app.use(registerParentController);

export default app;
