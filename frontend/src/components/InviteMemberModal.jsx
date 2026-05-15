import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const InviteMemberModal = ({ familyId, onClose, onSuccess }) => {
  const { api } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("contributor");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!familyId) {
        console.log("Family ID is missing. Cannot send invite.");
      setError("Family id is missing.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    setSubmitting(true);
    setError("");
    console.log("Sending invite to:", email, "with role:", role, "for family ID:", familyId);
    try {
      const response = await api.post("/invite/invite", {
        familyId,
        email: email.trim(),
        role,
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send invite.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#A65E2E]/10 text-[#A65E2E]">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Invite a Member
              </h2>
              <p className="text-sm text-gray-600">
                Send an invite email with a join token.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-6 px-6 py-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="inviteEmail">Email</Label>
            <Input
              id="inviteEmail"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inviteRole">Role</Label>
            <select
              id="inviteRole"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-gray-800 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <option value="admin">Admin</option>
              <option value="contributor">Contributor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#A65E2E] text-white hover:bg-[#8e4f26]"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default InviteMemberModal;
