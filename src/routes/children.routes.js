import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/authorize.js";
import {
  loginChildController,
  registerChildController,
} from "../controllers/children.controller.js";

const router = express.Router();

router.post(
  "/register",
  authenticate,
  requireRole("parent"),
  registerChildController,
);

router.post("/child/login", loginChildController);

export default router;
