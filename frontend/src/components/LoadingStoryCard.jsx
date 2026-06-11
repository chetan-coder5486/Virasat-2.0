import { motion } from "framer-motion";
import { X } from "lucide-react";

const LoadingStoryCard = ({ 
  uploadProgress = 0, 
  currentFileName = "Uploading...",
  onCancel 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group overflow-hidden rounded-lg border border-border bg-card"
    >
      {/* Skeleton Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ["100%", "-100%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="pt-5 pl-5 pr-5 pb-2 space-y-3">
        {/* Skeleton Date/Author */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
          <span className="text-border">•</span>
          <div className="h-3 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        </div>

        {/* Skeleton Title */}
        <div className="space-y-1.5">
          <div className="h-5 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
          <div className="h-5 w-1/2 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        </div>

        {/* Skeleton Description */}
        <div className="space-y-1.5 mb-4">
          <div className="h-3 w-full rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        </div>

        {/* Upload Progress Section */}
        <div className="rounded-lg bg-[#FDF0E3] p-3 border border-[#D9B99A]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-[#9E7A56] truncate">
              {currentFileName}
            </p>
            <p className="text-xs font-semibold text-[#A65E2E]">
              {uploadProgress}%
            </p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D9B99A]">
            <motion.div
              className="h-full rounded-full bg-[#A65E2E]"
              animate={{ width: `${uploadProgress}%` }}
              transition={{ ease: "linear", duration: 0.3 }}
            />
          </div>
        </div>

        {/* Skeleton Likes/Comments */}
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="h-3 w-12 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            <div className="h-3 w-12 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingStoryCard;
