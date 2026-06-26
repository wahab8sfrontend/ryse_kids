import express from "express";
import {
  registerParentController,
  loginParentController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/parent/register", registerParentController);

router.post("/parent/login", loginParentController);

export default router;
