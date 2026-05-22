import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const normalizeStory = (story) => {
  const firstMedia = story.memoryFiles?.find((media) => media?.url);
  return {
    id: story._id,
    title: story.title,
    excerpt: story.description || "",
    author: story.author,
    date: story.date,
    tags: Array.isArray(story.tags) ? story.tags : [],
    imageUrl: firstMedia?.url || "",
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