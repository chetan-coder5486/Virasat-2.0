import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Loader2, Upload, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const UPLOAD_PRESET = "family_trunk_uploads";

export const UploadMemoryModal = ({ onClose, circleId = null, onSubmit }) => {
  const { api } = useAuth();
  const todayStr = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    title: "",
    story: "",
    date: "",
    tags: "",
    isMilestone: false,
    memoryFiles: [],
  });

  const [errors, setErrors] = useState({
    title: "",
    story: "",
    date: "",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const mediaRef = useRef([]);

  // =========================
  // HANDLE INPUT CHANGES
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      const count = value.trim().split(/\s+/).length;
      setErrors((prev) => ({
        ...prev,
        title: count > 100 ? `Title has ${count} words. Max 100 allowed.` : "",
      }));
    }

    if (name === "story") {
      const count = value.trim().split(/\s+/).length;
      setErrors((prev) => ({
        ...prev,
        story: count > 200 ? `Story has ${count} words. Max 200 allowed.` : "",
      }));
    }

    if (name === "date") {
      const picked = new Date(value);
      const today = new Date(todayStr);
      setErrors((prev) => ({
        ...prev,
        date: picked > today ? "Date cannot be in future." : "",
      }));
    }
  };

  // =========================
  // CLOUDINARY UPLOAD
  // =========================

  const uploadToCloudinary = async (file, onProgress) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);

    const resourceType = file.type.startsWith("video") ? "video" : "image";
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      fd,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress) onProgress(progressEvent.loaded, progressEvent.total);
        },
      },
    );

    return {
      url: response.data.secure_url,
      type: resourceType,
      publicId: response.data.public_id,
    };
  };

  // =========================
  // DROPZONE
  // =========================

  const onDrop = useCallback((acceptedFiles) => {
    const selectedMedia = acceptedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setUploadedMedia((prev) => [...prev, ...selectedMedia]);
    setFormData((prev) => ({
      ...prev,
      memoryFiles: [...prev.memoryFiles, ...selectedMedia],
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [], "video/*": [] },
  });

  // =========================
  // REMOVE MEDIA
  // =========================

  const removeMedia = (index) => {
    const mediaToRemove = uploadedMedia[index];
    if (mediaToRemove?.previewUrl)
      URL.revokeObjectURL(mediaToRemove.previewUrl);

    const updated = uploadedMedia.filter((_, i) => i !== index);
    setUploadedMedia(updated);
    setFormData((prev) => ({ ...prev, memoryFiles: updated }));
  };

  const cleanupPreviews = (mediaList) => {
    mediaList.forEach((media) => {
      if (media?.previewUrl) URL.revokeObjectURL(media.previewUrl);
    });
  };

  const handleClose = () => {
    cleanupPreviews(uploadedMedia);
    onClose();
  };

  useEffect(() => {
    mediaRef.current = uploadedMedia;
  }, [uploadedMedia]);

  useEffect(() => {
    return () => cleanupPreviews(mediaRef.current);
  }, []);

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.title || errors.story || errors.date) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const totalBytes =
        formData.memoryFiles.reduce(
          (sum, media) => sum + (media.file?.size || 0),
          0,
        ) || 1;
      let uploadedBytes = 0;
      const uploadedFiles = [];

      for (const media of formData.memoryFiles) {
        const result = await uploadToCloudinary(media.file, (loaded) => {
          const percent = Math.round(
            ((uploadedBytes + loaded) / totalBytes) * 100,
          );
          setUploadProgress(percent);
        });
        uploadedBytes += media.file?.size || 0;
        setUploadProgress(Math.round((uploadedBytes / totalBytes) * 100));
        uploadedFiles.push(result);
      }

      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        description: formData.story,
        date: formData.date,
        tags,
        isMilestone: formData.isMilestone,
        memoryFiles: uploadedFiles,
        circleId,
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await api.post("/story/create", payload);
      }

      cleanupPreviews(uploadedMedia);
      onClose();
    } catch (error) {
      console.error("Failed to create memory:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    /*
      FIX 1 — Overlay: overflow-y-auto + py-4 so the modal can scroll on
      short viewports instead of being clipped. `items-start` (with auto
      margin on the card) lets the card start at the top of the scroll area
      rather than being vertically centred off-screen.
    */
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      {/*
        FIX 2 — Card: w-full + max-w-5xl keeps it from being wider than the
        screen. my-auto keeps it centred when there's room; when the viewport
        is short the overlay scroll takes over. max-h-[calc(100dvh-2rem)]
        hard-caps the card height so it never escapes the screen.
      */}
      <motion.div
        className="relative my-auto flex w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "calc(100dvh - 2rem)" }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/*
          FIX 3 — Inner scroll container: overflow-y-auto so the content
          scrolls inside the card rather than pushing the card off-screen.
          The padding is moved here so the scrollbar sits at the card edge.
        */}
        <div className="overflow-y-auto p-6">
          {/*
            FIX 4 — Grid: always single-column on mobile; two columns only
            on lg+ AND only when media is present. min-w-0 on both columns
            prevents content from breaking out of the grid track.
          */}
          <div
            className={`grid gap-6 ${
              uploadedMedia.length > 0 ? "lg:grid-cols-[1.2fr_0.8fr]" : ""
            }`}
          >
            {/* ── FORM COLUMN ── */}
            <div className="min-w-0">
              <h2 className="mb-6 text-3xl font-bold text-[#A65E2E]">
                Add a New Memory
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* TITLE */}
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    onChange={handleChange}
                    required
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* DATE */}
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    max={todayStr}
                    onChange={handleChange}
                    required
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                {/* STORY */}
                <div>
                  <Label htmlFor="story">Story</Label>
                  <Textarea
                    id="story"
                    name="story"
                    rows={5}
                    onChange={handleChange}
                  />
                  {errors.story && (
                    <p className="mt-1 text-sm text-red-600">{errors.story}</p>
                  )}
                </div>

                {/* TAGS */}
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="family, wedding, childhood"
                    onChange={handleChange}
                  />
                </div>

                {/* DROPZONE */}
                <div>
                  <Label>Photos or Videos</Label>
                  <div
                    {...getRootProps()}
                    className={`mt-2 cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition ${
                      isDragActive
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-[#A65E2E]"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                    <p className="font-medium text-gray-700">
                      Drag & Drop media here
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      or click to browse
                    </p>
                    <p className="mt-3 text-xs text-gray-400">
                      Images and videos supported
                    </p>
                  </div>
                </div>

                {/* UPLOAD PROGRESS */}
                {uploading && (
                  <div>
                    <p className="mb-2 text-sm text-green-600">
                      Uploading... {uploadProgress}%
                    </p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-green-600 transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* MILESTONE */}
                <div className="flex items-center gap-3">
                  <input
                    id="isMilestone"
                    name="isMilestone"
                    type="checkbox"
                    checked={formData.isMilestone}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isMilestone">Mark as milestone</Label>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      uploading ||
                      !!errors.title ||
                      !!errors.story ||
                      !!errors.date
                    }
                    className="bg-[#A65E2E] hover:bg-[#8c4f25]"
                  >
                    {uploading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Memory
                  </Button>
                </div>
              </form>
            </div>

            {/* ── MEDIA PREVIEW COLUMN ── */}
            {uploadedMedia.length > 0 && (
              /*
                FIX 5 — Preview panel: min-w-0 prevents grid blowout.
                max-h uses dvh so it's always relative to the actual visible
                viewport height. overflow-y-auto lets the grid scroll
                independently inside the panel.
              */
              <div className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">
                    Media Preview ({uploadedMedia.length} item
                    {uploadedMedia.length > 1 ? "s" : ""})
                  </h3>
                </div>

                <div
                  className="overflow-y-auto pr-1"
                  style={{ maxHeight: "calc(100dvh - 14rem)" }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {uploadedMedia.map((media, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
                          className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-1 text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        {media.type === "video" ? (
                          <video
                            src={media.previewUrl}
                            controls
                            className="h-32 w-full object-cover"
                          />
                        ) : (
                          <img
                            src={media.previewUrl}
                            alt="uploaded"
                            className="h-32 w-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


