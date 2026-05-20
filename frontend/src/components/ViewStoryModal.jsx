import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Tag, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ViewStoryModal = ({ story, onClose }) => {
  const [mediaIndex, setMediaIndex] = useState(0);

  const prev = useCallback(() => {
    setMediaIndex(i => (i - 1 + story.memoryFiles.length) % story.memoryFiles.length);
  }, [story?.memoryFiles?.length]);

  const next = useCallback(() => {
    setMediaIndex(i => (i + 1) % story.memoryFiles.length);
  }, [story?.memoryFiles?.length]);

  // keyboard navigation
  React.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next, onClose]);

  if (!story) return null;

  const files = story.memoryFiles || [];
  const currentMedia = files[mediaIndex];
  const hasMultiple = files.length > 1;

  const formattedDate = story.date
    ? new Date(story.date).toLocaleDateString("en-IN", { dateStyle: "long" })
    : "";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Layout: media left (60%), details right (40%) */}
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">

          {/* ── LEFT: Media Viewer ── */}
          <div className="relative lg:w-[60%] bg-black flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
            <AnimatePresence mode="wait">
              {currentMedia ? (
                <motion.div
                  key={mediaIndex}
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentMedia.type === "video" ? (
                    <video
                      src={currentMedia.url}
                      controls
                      className="max-h-[500px] w-full object-contain"
                    />
                  ) : (
                    <img
                      src={currentMedia.url}
                      alt={`${story.title} - ${mediaIndex + 1}`}
                      className="max-h-[500px] w-full object-contain"
                    />
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/40">
                  <Play className="h-12 w-12" />
                  <span className="text-sm">No media</span>
                </div>
              )}
            </AnimatePresence>

            {/* Left arrow */}
            {hasMultiple && (
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 transition z-10"
                aria-label="Previous media"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Right arrow */}
            {hasMultiple && (
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 transition z-10"
                aria-label="Next media"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {/* Dot indicators */}
            {hasMultiple && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {files.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMediaIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === mediaIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"
                    }`}
                    aria-label={`Go to media ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Counter */}
            {hasMultiple && (
              <div className="absolute top-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
                {mediaIndex + 1} / {files.length}
              </div>
            )}
          </div>

          {/* ── RIGHT: Story Details ── */}
          <div className="flex flex-col lg:w-[40%] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-[#A65E2E] leading-tight">
                  {story.title}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  {formattedDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formattedDate}
                    </span>
                  )}
                  {story.author?.name && (
                    <span className="flex items-center gap-1">
                      By <span className="font-medium text-gray-700">{story.author.name}</span>
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-5 space-y-4">
              {(story.description || story.excerpt) && (
                <p className="text-sm leading-relaxed text-gray-700">
                  {story.description || story.excerpt}
                </p>
              )}

              {story.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {files.length > 1 && (
              <div className="border-t border-gray-100 p-4">
                <p className="mb-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  All media ({files.length})
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {files.map((media, i) => (
                    <button
                      key={i}
                      onClick={() => setMediaIndex(i)}
                      className={`shrink-0 h-14 w-14 rounded-lg overflow-hidden border-2 transition ${
                        i === mediaIndex
                          ? "border-[#A65E2E]"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {media.type === "video" ? (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <Play className="h-4 w-4 text-gray-500" />
                        </div>
                      ) : (
                        <img
                          src={media.url}
                          alt={`thumb ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ViewStoryModal;