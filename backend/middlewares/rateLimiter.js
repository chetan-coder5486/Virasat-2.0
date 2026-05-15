// backend/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const inviteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // Max 5 join attempts per IP
  message: { error: 'Too many attempts. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false
});