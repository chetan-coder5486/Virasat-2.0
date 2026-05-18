import express from "express";
import { createCircle, getCirclesByUser } from "../controllers/circle.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create',authenticate,createCircle)
router.get('/my-circles',authenticate,getCirclesByUser)

export default router;