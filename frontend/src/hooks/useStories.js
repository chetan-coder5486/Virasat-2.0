import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const getVideoThumbnail = (videoUrl) => {
  // Change video URL to an image URL with transformations
  return videoUrl
    .replace("/video/upload/", "/video/upload/so_5,c_scale,w_500/")
    .replace(/\.[^/.]+$/, ".jpg"); // Changes extension to .jpg
};

const normalizeStory = (story) => {
  const firstMedia = story.memoryFiles?.find((media) => media?.url);
  const firstMediaUrl = (firstMedia?.type === "video" ? getVideoThumbnail(firstMedia.url) : firstMedia?.url) || "";
  console.log("Normalizing story:", { story, firstMedia });
  return {
    id: story._id,
    title: story.title,
    excerpt: story.description || "",
    author: story.author,
    date: story.date,
    tags: Array.isArray(story.tags) ? story.tags : [],
    imageUrl: firstMediaUrl,
    likes: story.likes ?? 0,
    comments: story.comments ?? 0,
    memoryFiles: story.memoryFiles || [],
    circle: story.circle || null,
  };
};



export function useStories(circleId = null, options = {}) {
  const { api } = useAuth();
  const { enabled = true } = options;

  const { data: stories = [], isPending: loading, error } = useQuery({
    queryKey: ["stories", circleId ?? "family"],
    queryFn: async () => {
      const params = circleId ? { circleId } : {};
      const res = await api.get("/story", { params });
      return (res.data.data || []).map(normalizeStory);
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });

  return {
    stories,
    loading,
    error:
      error?.response?.data?.message ||
      (error ? "Failed to load stories." : ""),
  };
}

