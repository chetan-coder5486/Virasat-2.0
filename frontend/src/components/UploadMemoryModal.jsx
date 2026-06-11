import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  Loader2,
  Upload,
  X,
  Plus,
  Star,
  Calendar,
  Tag,
  FileText,
  Image,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const UPLOAD_PRESET_IMAGES = "family_trunk_uploads";
const UPLOAD_PRESET_VIDEOS = "family_trunk_video_uploads"
const SIGNATURE_ENDPOINT = "/user/cloudinary-signature";

// ── Tiny helpers ──────────────────────────────────────────────────────────────

const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const wordCount = (str) =>
  str.trim() === "" ? 0 : str.trim().split(/\s+/).length;

// ── Tag pill input ─────────────────────────────────────────────────────────────

function TagInput({ tags, onChange }) {
  const [input, setInput] = useState("");

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "" && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-[#D9B99A] bg-[#FDF6EE] px-3 py-2 focus-within:border-[#A65E2E] focus-within:ring-1 focus-within:ring-[#A65E2E]/30 transition-all">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-[#A65E2E]/10 px-2.5 py-0.5 text-xs font-medium text-[#7A3E18]"
        >
          #{tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="ml-0.5 rounded-full hover:text-red-500 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? "Add tags — press Enter or comma" : ""}
        className="min-w-[120px] flex-1 bg-transparent text-sm text-[#4A2C14] placeholder-[#C4A882] outline-none"
      />
    </div>
  );
}

// ── Step indicator ─────────────────────────────────────────────────────────────

function StepDot({ active, done, label, number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
          done
            ? "bg-[#A65E2E] text-white"
            : active
              ? "bg-[#A65E2E]/15 text-[#A65E2E] ring-2 ring-[#A65E2E]"
              : "bg-[#F0E6D9] text-[#C4A882]"
        }`}
      >
        {done ? "✓" : number}
      </div>
      <span
        className={`text-[10px] font-medium ${active || done ? "text-[#A65E2E]" : "text-[#C4A882]"}`}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export const UploadMemoryModal = ({
  onClose,
  onCreated,
  circleId = null,
  circleName = null,
}) => {
  const { api } = useAuth();

  const queryClient = useQueryClient();

  const todayStr = new Date().toISOString().slice(0, 10);
  const isCircleStory = Boolean(circleId);

  const [step, setStep] = useState(1); // 1 = details, 2 = media

  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState([]);
  const [isMilestone, setIsMilestone] = useState(false);

  const [errors, setErrors] = useState({});

  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileLabel, setCurrentFileLabel] = useState("");

  const mediaRef = useRef([]);

  useEffect(() => {
    mediaRef.current = uploadedMedia;
  }, [uploadedMedia]);
  useEffect(() => () => cleanupPreviews(mediaRef.current), []);

  const cleanupPreviews = (list) =>
    list.forEach((m) => m.previewUrl && URL.revokeObjectURL(m.previewUrl));

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required.";
    else if (wordCount(title) > 100)
      errs.title = `Max 100 words (${wordCount(title)} used).`;
    if (story && wordCount(story) > 500)
      errs.story = `Max 500 words (${wordCount(story)} used).`;
    if (!date) errs.date = "Date is required.";
    else if (new Date(date) > new Date(todayStr))
      errs.date = "Date cannot be in the future.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const canProceed =
    title.trim() && date && !errors.title && !errors.date && !errors.story;

  // ── Dropzone ────────────────────────────────────────────────────────────────

  const onDrop = useCallback((acceptedFiles) => {
    const newMedia = acceptedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      name: file.name,
      size: file.size,
    }));
    setUploadedMedia((prev) => [...prev, ...newMedia]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [], "video/*": [] },
  });

  const removeMedia = (index) => {
    URL.revokeObjectURL(uploadedMedia[index]?.previewUrl);
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Upload to Cloudinary ────────────────────────────────────────────────────

  const getCloudinarySignature = async (resourceType,preset) => {
    const response = await api.post(SIGNATURE_ENDPOINT, {
      uploadPreset: preset,
      resourceType,
    });
    return response.data;
  };

  const uploadToCloudinary = async (file, onProgress) => {
    const fd = new FormData();
    const resourceType = file.type.startsWith("video") ? "video" : "image";
    const preset = (resourceType==="video")?UPLOAD_PRESET_VIDEOS:UPLOAD_PRESET_IMAGES
    const { signature, timestamp, apiKey, cloudName } =
      await getCloudinarySignature(resourceType,preset);

    fd.append("file", file);
    fd.append("api_key", apiKey);
    fd.append("timestamp", timestamp);
    fd.append("signature", signature);
    fd.append("upload_preset", preset);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName || import.meta.env.VITE_CLOUDINARY_NAME}/${resourceType}/upload`,
      fd,
      { onUploadProgress: (e) => onProgress?.(e.loaded, e.total) },
    );
    return {
      url: res.data.secure_url,
      type: resourceType,
      publicId: res.data.public_id,
    };
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const totalBytes =
        uploadedMedia.reduce((s, m) => s + (m.file?.size || 0), 0) || 1;
      let uploadedBytes = 0;
      const uploadedFiles = [];

      for (const media of uploadedMedia) {
        setCurrentFileLabel(media.name);
        const result = await uploadToCloudinary(media.file, (loaded) => {
          setUploadProgress(
            Math.round(((uploadedBytes + loaded) / totalBytes) * 100),
          );
        });
        uploadedBytes += media.file?.size || 0;
        setUploadProgress(Math.round((uploadedBytes / totalBytes) * 100));
        uploadedFiles.push(result);
      }

      const payload = {
        title: title.trim(),
        description: story.trim(),
        date,
        tags,
        isMilestone,
        circle: circleId, // null = family-wide, id = circle story
        memoryFiles: uploadedFiles,
      };

      const res = await api.post("/story/create", payload);
      cleanupPreviews(uploadedMedia);
      queryClient.invalidateQueries({
        queryKey: ["stories", circleId ?? "family"],
      });
      if (onCreated) onCreated(res.data);
      onClose();
    } catch (err) {
      console.error("Failed to create memory:", err);
      setErrors((prev) => ({
        ...prev,
        submit: err.response?.data?.message || "Failed to save memory.",
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    cleanupPreviews(uploadedMedia);
    onClose();
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/60 p-0 sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="relative w-full max-w-2xl overflow-hidden rounded-t-3xl bg-[#FFFAF5] sm:rounded-3xl"
        style={{ maxHeight: "calc(100dvh - 1rem)" }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[#D9B99A] sm:hidden" />

        {/* Header */}
        <div className="relative flex items-start justify-between px-6 pt-5 pb-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#A65E2E]/10">
                <Image className="h-4 w-4 text-[#A65E2E]" />
              </span>
              <h2 className="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#4A2C14]">
                Add a Memory
              </h2>
            </div>
            <p className="text-xs text-[#9E7A56]">
              {isCircleStory
                ? `Sharing to ${circleName ?? "this circle"}`
                : "Preserve this moment for the whole family"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-[#9E7A56] hover:bg-[#F0E6D9] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 px-6 pb-4">
          <StepDot
            number={1}
            label="Details"
            active={step === 1}
            done={step > 1}
          />
          <div
            className={`mb-4 h-px w-12 transition-colors duration-300 ${step > 1 ? "bg-[#A65E2E]" : "bg-[#D9B99A]"}`}
          />
          <StepDot number={2} label="Media" active={step === 2} done={false} />
        </div>

        {/* Scrollable body */}
        <div
          className="overflow-y-auto px-6 pb-6"
          style={{ maxHeight: "calc(100dvh - 13rem)" }}
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* ── STEP 1: Details ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  className="space-y-5"
                >
                  {/* Title */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E7A56]">
                      <FileText className="h-3.5 w-3.5" /> Title
                    </label>
                    <input
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (wordCount(e.target.value) > 100)
                          setErrors((p) => ({
                            ...p,
                            title: `Max 100 words (${wordCount(e.target.value)} used).`,
                          }));
                        else setErrors((p) => ({ ...p, title: "" }));
                      }}
                      placeholder="e.g. Dad's first motorcycle, 1972"
                      className="w-full rounded-xl border border-[#D9B99A] bg-[#FDF6EE] px-4 py-2.5 text-sm text-[#4A2C14] placeholder-[#C4A882] outline-none transition-all focus:border-[#A65E2E] focus:ring-1 focus:ring-[#A65E2E]/30"
                      required
                    />
                    {errors.title && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E7A56]">
                      <Calendar className="h-3.5 w-3.5" /> When did this happen?
                    </label>
                    <input
                      type="date"
                      value={date}
                      max={todayStr}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setErrors((p) => ({
                          ...p,
                          date:
                            new Date(e.target.value) > new Date(todayStr)
                              ? "Date cannot be in the future."
                              : "",
                        }));
                      }}
                      className="w-full rounded-xl border border-[#D9B99A] bg-[#FDF6EE] px-4 py-2.5 text-sm text-[#4A2C14] outline-none transition-all focus:border-[#A65E2E] focus:ring-1 focus:ring-[#A65E2E]/30"
                      required
                    />
                    {errors.date && (
                      <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                    )}
                  </div>

                  {/* Story */}
                  <div>
                    <label className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#9E7A56]">
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" /> Story
                      </span>
                      <span className="normal-case font-normal text-[#C4A882]">
                        {wordCount(story)} / 500 words
                      </span>
                    </label>
                    <textarea
                      value={story}
                      onChange={(e) => {
                        setStory(e.target.value);
                        if (wordCount(e.target.value) > 500)
                          setErrors((p) => ({ ...p, story: `Max 500 words.` }));
                        else setErrors((p) => ({ ...p, story: "" }));
                      }}
                      rows={4}
                      placeholder="Tell the story behind this memory… what happened, who was there, how it felt."
                      className="w-full resize-none rounded-xl border border-[#D9B99A] bg-[#FDF6EE] px-4 py-2.5 text-sm text-[#4A2C14] placeholder-[#C4A882] outline-none transition-all focus:border-[#A65E2E] focus:ring-1 focus:ring-[#A65E2E]/30"
                    />
                    {errors.story && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.story}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E7A56]">
                      <Tag className="h-3.5 w-3.5" /> Tags
                    </label>
                    <TagInput tags={tags} onChange={setTags} />
                  </div>

                  {/* Milestone toggle */}
                  <button
                    type="button"
                    onClick={() => setIsMilestone((p) => !p)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                      isMilestone
                        ? "border-[#E8B86D] bg-[#FEF7EC]"
                        : "border-[#D9B99A] bg-[#FDF6EE] hover:border-[#C4A882]"
                    }`}
                  >
                    <Star
                      className={`h-5 w-5 flex-shrink-0 transition-colors ${isMilestone ? "fill-[#E8B86D] text-[#E8B86D]" : "text-[#C4A882]"}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#4A2C14]">
                        Mark as milestone
                      </p>
                      <p className="text-xs text-[#9E7A56]">
                        Highlighted on the family timeline
                      </p>
                    </div>
                    <div
                      className={`h-5 w-9 rounded-full transition-colors duration-200 ${isMilestone ? "bg-[#A65E2E]" : "bg-[#D9B99A]"}`}
                    >
                      <div
                        className={`mt-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${isMilestone ? "translate-x-4" : "translate-x-0.5"}`}
                      />
                    </div>
                  </button>

                  {/* Next button */}
                  <button
                    type="button"
                    disabled={!canProceed}
                    onClick={() => {
                      if (validate()) setStep(2);
                    }}
                    className="w-full rounded-xl bg-[#A65E2E] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    Next — Add Photos & Videos
                  </button>
                </motion.div>
              )}

              {/* ── STEP 2: Media ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-5"
                >
                  {/* Summary pill */}
                  <div className="flex items-center gap-2 rounded-xl bg-[#F0E6D9] px-4 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-[#4A2C14]">
                        {title}
                      </p>
                      <p className="text-xs text-[#9E7A56]">
                        {date}
                        {isMilestone ? " · ⭐ Milestone" : ""}
                        {isCircleStory
                          ? ` · ${circleName ?? "Circle"}`
                          : " · Family"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-medium text-[#A65E2E] underline underline-offset-2"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Dropzone */}
                  <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                      isDragActive
                        ? "border-[#A65E2E] bg-[#FDF0E3]"
                        : "border-[#D9B99A] hover:border-[#A65E2E] hover:bg-[#FDF6EE]"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload
                      className={`mx-auto mb-2 h-8 w-8 transition-colors ${isDragActive ? "text-[#A65E2E]" : "text-[#C4A882]"}`}
                    />
                    <p className="text-sm font-medium text-[#4A2C14]">
                      {isDragActive
                        ? "Drop them here"
                        : "Drag photos & videos here"}
                    </p>
                    <p className="mt-1 text-xs text-[#9E7A56]">
                      or click to browse your device
                    </p>
                  </div>

                  {/* Media grid */}
                  {uploadedMedia.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#9E7A56]">
                        {uploadedMedia.length} file
                        {uploadedMedia.length > 1 ? "s" : ""} selected
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {uploadedMedia.map((media, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative aspect-square overflow-hidden rounded-xl border border-[#D9B99A] bg-[#F0E6D9]"
                          >
                            {media.type === "video" ? (
                              <video
                                src={media.previewUrl}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <img
                                src={media.previewUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
                            <button
                              type="button"
                              onClick={() => removeMedia(i)}
                              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            {media.type === "video" && (
                              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                                VIDEO
                              </span>
                            )}
                          </motion.div>
                        ))}

                        {/* Add more button */}
                        <div
                          {...getRootProps()}
                          className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D9B99A] text-[#C4A882] hover:border-[#A65E2E] hover:text-[#A65E2E] transition-colors"
                        >
                          <input {...getInputProps()} />
                          <Plus className="h-6 w-6" />
                          <span className="mt-1 text-[10px]">Add more</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload progress */}
                  {uploading && (
                    <div className="rounded-xl bg-[#FDF0E3] p-3">
                      <div className="mb-1.5 flex items-center justify-between">
                        <p className="text-xs text-[#9E7A56] truncate">
                          {currentFileLabel}
                        </p>
                        <p className="text-xs font-semibold text-[#A65E2E]">
                          {uploadProgress}%
                        </p>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D9B99A]">
                        <motion.div
                          className="h-full rounded-full bg-[#A65E2E]"
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ ease: "linear", duration: 0.2 }}
                        />
                      </div>
                    </div>
                  )}

                  {errors.submit && (
                    <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
                      {errors.submit}
                    </p>
                  )}

                  {/* Footer buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={uploading}
                      className="flex-1 rounded-xl border border-[#D9B99A] py-3 text-sm font-medium text-[#9E7A56] hover:bg-[#F0E6D9] transition-colors disabled:opacity-40"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      onClick={handleSubmit}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#A65E2E] py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        "Save Memory"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UploadMemoryModal;
