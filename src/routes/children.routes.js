import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/authorize.js";

const router = express.Router();

router.post("/register", authenticate, requireRole("parent"), (req, res) => {
  res.json({ message: "middleware passed", user: req.user });
});

export default router;
