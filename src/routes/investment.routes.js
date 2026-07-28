import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  createInvestmentController,
  getChildInvestmentController,
} from "../controllers/investment.controller.js";
import { requireRole } from "../middleware/authorize.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  requireRole("child"),
  createInvestmentController,
);

router.get("/:childId", authenticate, getChildInvestmentController);

export default router;
