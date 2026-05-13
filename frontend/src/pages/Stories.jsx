import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar.jsx";
import StoryCard from "@/components/StoryCard.jsx";
import { UploadMemoryModal } from "@/components/UploadMemoryModal.jsx";
import { motion } from "framer-motion";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const Stories = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { api } = useAuth();

  useEffect(() => {
    if (location.state?.openUpload) {
      setIsUploadOpen(true);
      navigate("/stories", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/story/");
        const items = response.data?.stories || response.data.data || [];
        const normalized = items.map((story) => ({
          id: story._id || story.id || story.slug || story.title,
          title: story.title || "Untitled",
          excerpt: story.description || story.story || "",
          author:
            story.author?.name || story.authorName || story.author || "Unknown",
          date: story.date || "",
          tags: Array.isArray(story.tags) ? story.tags : [],
          likes: story.likesCount || story.likes?.length || 0,
          comments: story.commentsCount || story.comments?.length || 0,
          imageUrl:
            story.coverImage || story.imageUrl || story.memoryFiles?.[0]?.url,
        }));

        setStories(normalized);
        setError("");
      } catch (err) {
        console.error("Failed to fetch stories:", err);
        setError("Failed to load stories.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [api]);

  const allTags = useMemo(() => {
    const tags = new Set();
    stories.forEach((story) => {
      story.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [stories]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {isUploadOpen && (
        <UploadMemoryModal onClose={() => setIsUploadOpen(false)} />
      )}
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="mb-2 font-display text-4xl font-bold text-foreground">
            All Stories
          </h1>
          <p className="mb-6 text-muted-foreground">
            Browse and search through your family's memories
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search stories..." className="pl-10" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="icon">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <List className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading stories...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-600">{error}</div>
        ) : stories.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No stories yet. Create your first memory.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, i) => (
              <StoryCard key={story.id} {...story} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
