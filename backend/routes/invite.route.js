// backend/routes/inviteRoutes.js
import express from 'express';
import { sendInvite, joinWithToken, reviewRequest, listJoinRequests } from '../controllers/invite.controller.js';
import { inviteLimiter } from '../middlewares/rateLimiter.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/invite', authenticate, authorize(['admin']), sendInvite);
router.post('/join', authenticate, inviteLimiter, joinWithToken);
router.get('/requests', authenticate,authorize(['admin']), listJoinRequests);
router.post('/requests/:requestId/review', authenticate, authorize(['admin']), reviewRequest);

export default router;