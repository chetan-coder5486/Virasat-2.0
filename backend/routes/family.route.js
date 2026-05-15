import express from 'express';
import { createFamily, getFamilyDetails } from '../controllers/family.controller.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticate,authorize(['creator']),createFamily);
router.get('/', authenticate, getFamilyDetails);

export default router;