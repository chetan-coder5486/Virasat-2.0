import express from "express";
import { createCircle } from "../controllers/circle.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create',authenticate,createCircle)

export default router;