import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

const CreateFamilyForm = ({ onClose, onSubmit }) => {
  const { api } = useAuth();
  const [formData, setFormData] = useState({
    familyName: "",
    memberEmails: "",
  });
  const [errors, setErrors] = useState({
    familyName: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "familyName") {
      setErrors((prev) => ({
        ...prev,
        familyName: value.trim() ? "" : "Family name is required.",
      }));
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const familyName = formData.familyName.trim();
    if (!familyName) {
      setErrors((prev) => ({
        ...prev,
        familyName: "Family name is required.",
      }));
      return;
    }

    const members = formData.memberEmails
      .split(/[,\n]/)
      .map((email) => email.trim())
      .filter(Boolean);
    try{
        api.post("/family/create/", {
            name: familyName,
            members: members,
        })
    }catch(error){
        console.error("Error creating family:", error);
    }

    handleClose();
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
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create Family
            </h2>
            <p className="text-sm text-gray-600">
              Add a family name and invite members by email.
            </p>
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
            <Label htmlFor="familyName">Family name</Label>
            <Input
              id="familyName"
              name="familyName"
              placeholder="e.g. The Mehta Family"
              value={formData.familyName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.familyName)}
            />
            {errors.familyName ? (
              <p className="text-xs text-red-500">{errors.familyName}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberEmails">Members (emails)</Label>
            <Textarea
              id="memberEmails"
              name="memberEmails"
              placeholder="Add emails separated by commas or new lines"
              value={formData.memberEmails}
              onChange={handleChange}
              rows={4}
            />
            <p className="text-xs text-gray-500">
              We will send invitations after you create the family.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#A65E2E] text-white hover:bg-[#8e4f26]"
            >
              Create Family
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateFamilyForm;
