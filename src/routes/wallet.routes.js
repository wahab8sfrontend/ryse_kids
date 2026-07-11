import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/authorize.js";
import { fundWalletController } from "../controllers/wallet.controller.js";

const router = express.Router();

router.post("/fund", authenticate, requireRole("parent"), fundWalletController);

export default router;
