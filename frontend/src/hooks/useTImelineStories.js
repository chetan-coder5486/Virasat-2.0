import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const getSeasonFromDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "default";
  }

  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
};

const normalizeTimelineStory = (story) => {
  const date = story.date ? new Date(story.date) : null;
  const year = date && !Number.isNaN(date.getTime()) ? `${date.getFullYear()}` : "";
  return {
    id: story._id,
    author: story.author,
    title: story.title,
    description: story.description || "",
    season: getSeasonFromDate(story.date),
    year,
    tags: Array.isArray(story.tags) ? story.tags : [],
    memoryFiles: story.memoryFiles || [],
    date: story.date || null,
    raw: story,
  };
};

export function useTimelineStories(options = {}) {
  const { api } = useAuth();
  const { enabled = true } = options;

  const { data: stories = [], isPending: loading, error } = useQuery({
    queryKey: ["stories", "timeline"],
    queryFn: async () => {
      const res = await api.get("/story/timeline");
      return (res.data.data || [])
        .map(normalizeTimelineStory)
        .sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(a.date) - new Date(b.date);
        });
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });

  return {
    stories,
    loading,
    error:
      error?.response?.data?.message ||
      (error ? "Failed to load timeline stories." : ""),
  };
}