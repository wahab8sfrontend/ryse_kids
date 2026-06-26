import express from "express";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/", authenticate, (req, res) => {
  res.json({ message: "middleware passed", user: req.user });
});

export default router;
