// backend/controllers/inviteController.js
import FamilyInvite from '../models/family.invite.model.js';
import JoinRequest from '../models/join.request.model.js';
import { Family } from '../models/family.model.js';
import { User }
  from '../models/user.model.js';
import { generateInviteToken, getExpiryTime } from '../utils/inviteTokenUtils.js';
import { sendInviteEmail, sendApprovalEmail, sendDenialEmail } from '../utils/emailService.js';

// POST /api/invite  — Admin sends invite
export async function sendInvite(req, res) {
  try {
    const { familyId, email, role } = req.body;
    const adminId = req.user.userId;

    // 2. Check not already a member
    const alreadyMember = await User.findOne({ email, family: familyId });
    if (alreadyMember) {
      return res.status(400).json({ error: 'This person is already a member' });
    }

    // 3. Revoke any existing pending invite for same email+family
    await FamilyInvite.updateMany(
      { familyId, invitedEmail: email, status: 'pending' },
      { status: 'revoked' }
    );

    // 4. Generate token + expiry
    const token = generateInviteToken();
    const expiresAt = getExpiryTime(72); // 72 hours
    console.log(`Generated invite token: ${token} for email: ${email} expiring at: ${expiresAt}`);
    // 5. Save invite to DB
    await FamilyInvite.create({
      familyId,
      token,
      invitedBy: adminId,
      invitedEmail: email.toLowerCase(),
      role,
      expiresAt
    });
    console.log(`Invite saved to DB for ${email} with token ${token}`);
    // 6. Send email
    const admin = await User.findById(adminId);
    const family = await Family.findById(familyId);
    try{

      await sendInviteEmail({
        to: email,
        token,
        familyName: family.name,
        inviterName: admin.name,
        expiresAt
      });
    }catch(emailErr){
      console.error(`Failed to send invite email to ${email}:`, emailErr);
    }
    console.log(`Invite email sent to ${email} with token ${token}`);
    res.json({ success: true, message: `Invite sent to ${email}` });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/join  — User submits token
export async function joinWithToken(req, res) {
  try {
    const { token } = req.body;
    const userId = req.user.userId;
    const userEmail = req.user.email;

    // 1. Find invite
    const invite = await FamilyInvite.findOne({ token });
    if (!invite) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    // 2. Check expiry
    if (new Date() > invite.expiresAt) {
      await FamilyInvite.findByIdAndUpdate(invite._id, { status: 'expired' });
      return res.status(410).json({ error: 'This invite has expired' });
    }

    // 3. Check status
    if (invite.status !== 'pending') {
      return res.status(400).json({ error: 'This invite has already been used or revoked' });
    }

    // 4. Email must match
    if (userEmail.toLowerCase() !== invite.invitedEmail) {
      return res.status(403).json({
        error: 'This invite was sent to a different email address'
      });
    }

    // 5. Create join request
    await JoinRequest.create({
      familyId: invite.familyId,
      inviteId: invite._id,
      requesterId: userId
    });

    // 6. Mark invite as used
    await FamilyInvite.findByIdAndUpdate(invite._id, { status: 'used' });

    // 7. Notify admin (push notification or email)
    const family = await Family.findById(invite.familyId).populate('admins');
    const user = await User.findById(userId);
    // (send email/push to each admin here)

    res.json({
      success: true,
      message: 'Request submitted! Waiting for admin approval.'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/requests/:requestId/review  — Admin approves/denies
export async function reviewRequest(req, res) {
  try {
    const { requestId } = req.params;
    const { decision } = req.body; // 'approved' or 'denied'
    const adminId = req.user.userId;

    const request = await JoinRequest.findById(requestId)
      .populate('requesterId', 'name email')
      .populate('familyId');

    if (!request) return res.status(404).json({ error: 'Request not found' });



    // Update request
    request.status = decision;
    request.reviewedBy = adminId;
    request.reviewedAt = new Date();
    await request.save();

    if (decision === 'approved') {
      // Add to family members
      await Family.findByIdAndUpdate(request.familyId._id, {
        $addToSet: { members: request.requesterId._id }
      });
      await sendApprovalEmail({
        to: request.requesterId.email,
        familyName: request.familyId.name
      });
    } else {
      await sendDenialEmail({
        to: request.requesterId.email,
        familyName: request.familyId.name
      });
    }

    res.json({ success: true, decision });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/requests?familyId=...&status=pending
export async function listJoinRequests(req, res) {
  try {
    const { familyId, status = 'pending' } = req.query;
    const adminId = req.user.userId;

    if (!familyId) {
      return res.status(400).json({ error: 'familyId is required' });
    }

    const family = await Family.findById(familyId);
    if (!family) return res.status(404).json({ error: 'Family not found' });


    const requests = await JoinRequest.find({ familyId, status })
      .populate('requesterId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}