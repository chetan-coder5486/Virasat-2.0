// hooks/useStories.js
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useStories(circleId = null) {
  const { api } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError("");
      try {
        const params = circleId ? { circleId } : {};
        const res = await api.get("/story", { params });
        console.log("Fetched stories:", res.data.data);
        const rawStories = Array.isArray(res.data.data) ? res.data.data : [];
        const normalized = rawStories.map((story) => {
          const firstMedia = story.memoryFiles?.find((media) => media?.url);
          return {
            id: story._id || story.id,
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
        });
        if (mounted) setStories(normalized);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || "Failed to load stories.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [api, circleId]);  // re-fetches if circleId changes

  return { stories, loading, error };
}