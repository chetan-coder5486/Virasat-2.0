import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const CreateCircleModal = ({ onClose, onCreated }) => {
  const { api, family } = useAuth();
  const queryClient = useQueryClient();
  const [circleName, setCircleName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return family?.members || [];
    return (family?.members || []).filter((member) => {
      const nameMatch = member.name?.toLowerCase().includes(term);
      const emailMatch = member.email?.toLowerCase().includes(term);
      return nameMatch || emailMatch;
    });
  }, [family, search]);

  const toggleMember = (memberId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = circleName.trim();

    if (!trimmedName) {
      setError("Circle name is required.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const payload = {
        name: trimmedName,
        members: Array.from(selectedIds),
      };
      const response = await api.post("/circle/create", payload);
      queryClient.invalidateQueries({ queryKey: ["circles"] });
      if (onCreated) onCreated(response.data);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create circle.");
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
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create a Circle
              </h2>
              <p className="text-sm text-gray-600">
                Name the circle and select family members.
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
            <Label htmlFor="circleName">Circle name</Label>
            <Input
              id="circleName"
              placeholder="e.g. Jaipur Roots"
              value={circleName}
              onChange={(event) => setCircleName(event.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="memberSearch">Family members</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="memberSearch"
                placeholder="Search by name or email"
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50/70 p-3">
              {loading ? (
                <p className="text-sm text-gray-600">Loading members...</p>
              ) : filteredMembers.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No matching family members.
                </p>
              ) : (
                filteredMembers.map((member) => {
                  const isSelected = selectedIds.has(member._id);
                  return (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => toggleMember(member._id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition ${
                        isSelected
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-transparent bg-white hover:border-gray-200"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? "text-emerald-700" : "text-gray-400"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-500"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Circle"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateCircleModal;
