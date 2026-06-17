import express from "express";

const router = express.Router();

import authController from "../controllers/auth.controller.js";

router.post("/api/auth/parent/register", authController.registerParent);
