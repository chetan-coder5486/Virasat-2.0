// backend/utils/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SendGrid, Resend, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendInviteEmail({ to, token, familyName, inviterName, expiresAt }) {
    console.log("Entered sendInviteEmail with params:", { to, token, familyName, inviterName, expiresAt });
  const joinLink = `${process.env.CLIENT_URL}/join?token=${token}`;
  const expiry = new Date(expiresAt).toLocaleString();
    console.log(`Preparing to send invite email to ${to} with token ${token} expiring at ${expiry}`);
  await transporter.sendMail({
    from: `"Family Trunk" <${process.env.EMAIL_USER}>`,
    to,
    subject: `You're invited to join the ${familyName} family on Family Trunk`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>You've been invited! 🎉</h2>
        <p><strong>${inviterName}</strong> has invited you to join 
           <strong>${familyName}</strong> on Family Trunk.</p>

        <div style="background:#f4f4f4; padding:20px; border-radius:8px; 
                    text-align:center; letter-spacing:4px; font-size:22px; 
                    font-weight:bold; margin: 20px 0;">
          ${token}
        </div>

        <a href="${joinLink}" style="display:block; background:#6B21A8; color:white;
           text-align:center; padding:14px; border-radius:8px; 
           text-decoration:none; font-weight:bold;">
          Join Family Now
        </a>

        <p style="color:#888; font-size:13px; margin-top:16px;">
          ⚠️ This invite expires on ${expiry}.<br/>
          If you don't know ${inviterName}, please ignore this email.
        </p>
      </div>
    `
  });
}

export async function sendApprovalEmail({ to, familyName }) {
  await transporter.sendMail({
    from: `"Family Trunk" <${process.env.EMAIL_USER}>`,
    to,
    subject: `You're now part of the ${familyName} family!`,
    html: `<p>Your request to join <strong>${familyName}</strong> has been approved. Welcome! 🎊</p>`
  });
}

export async function sendDenialEmail({ to, familyName }) {
  await transporter.sendMail({
    from: `"Family Trunk" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Update on your Family Trunk request`,
    html: `<p>Your request to join <strong>${familyName}</strong> was not approved at this time.</p>`
  });
}