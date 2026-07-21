import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/authorize.js";
import {
  fundWalletController,
  getWalletController,
  transferFundController,
  getWalletTransactionsController,
} from "../controllers/wallet.controller.js";

const router = express.Router();

router.post("/fund", authenticate, requireRole("parent"), fundWalletController);

router.post(
  "/allocate",
  authenticate,
  requireRole("parent"),
  transferFundController,
);

router.get("/:id", authenticate, getWalletController);

router.get("/:id/transactions", authenticate, getWalletTransactionsController);

export default router;
