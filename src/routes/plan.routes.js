import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getPlansController } from "../controllers/plan.controller.js";

const router = express.Router();

router.get("/", getPlansController);

export default router;
