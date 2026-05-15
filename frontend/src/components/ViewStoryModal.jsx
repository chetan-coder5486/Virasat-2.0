import React from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ViewStoryModal = ({ story, onClose }) => {
  if (!story) {
    return null;
  }

  const formattedDate = story.date
    ? new Date(story.date).toLocaleDateString("en-IN", { dateStyle: "long" })
    : "";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#A65E2E]">{story.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </span>
              )}
              {story.author && <span>By {story.author}</span>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              {story.description || story.excerpt}
            </p>

            {story.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
            <h3 className="mb-3 text-base font-semibold text-gray-900">
              Media ({story.memoryFiles?.length || 0})
            </h3>
            {story.memoryFiles?.length ? (
              <div className="overflow-y-auto pr-1 max-h-96">
                <div className="grid grid-cols-2 gap-3">
                  {story.memoryFiles.map((media, index) => (
                    <div
                      key={`${media.url}-${index}`}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      {media.type === "video" ? (
                        <video
                          src={media.url}
                          controls
                          className="h-32 w-full object-cover"
                        />
                      ) : (
                        <img
                          src={media.url}
                          alt={story.title}
                          className="h-32 w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No media attached.</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ViewStoryModal;
