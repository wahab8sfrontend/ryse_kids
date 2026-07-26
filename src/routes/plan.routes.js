import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  getPlansController,
  createInvestmentController,
} from "../controllers/plan.controller.js";
import { requireRole } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getPlansController);

router.post(
  "/invest",
  authenticate,
  requireRole("child"),
  createInvestmentController,
);

export default router;
