// backend/utils/tokenGenerator.js
import crypto from 'crypto';

// Remove confusable chars: 0, O, 1, l, I
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

export function generateInviteToken() {
  const bytes = crypto.randomBytes(32); // Extra entropy
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += CHARS[bytes[i] % CHARS.length];
  }
  return token; // e.g. "k9mX2pQvN8rLwT4j"
}

export function getExpiryTime(hours = 72) {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
}