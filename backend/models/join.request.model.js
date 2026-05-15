// backend/models/JoinRequest.js
import mongoose from 'mongoose';

const JoinRequestSchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  inviteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyInvite'
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, { timestamps: true });

export default mongoose.model('JoinRequest', JoinRequestSchema);