// backend/models/FamilyInvite.js
import mongoose from 'mongoose';

const FamilyInviteSchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    length: 16
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitedEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['admin', 'contributor', 'viewer'],
    default: 'contributor'
  },
  status: {
    type: String,
    enum: ['pending', 'used', 'expired', 'revoked'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Auto-expire index — MongoDB will mark as expired at TTL
FamilyInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('FamilyInvite', FamilyInviteSchema);