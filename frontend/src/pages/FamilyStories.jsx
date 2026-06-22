import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar.jsx";
import StoryCard from "@/components/StoryCard.jsx";
import LoadingStoryCard from "@/components/LoadingStoryCard.jsx";
import { UploadMemoryModal } from "@/components/UploadMemoryModal.jsx";
import ViewStoryModal from "@/components/ViewStoryModal.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStories } from "@/hooks/useStories";
import { useFamily } from "@/hooks/useFamily.js";
import { useAuth } from "@/context/AuthContext";
import { useUpload } from "@/context/UploadContext";
import { useQueryClient } from "@tanstack/react-query";

const Stories = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [showFilters, setShowFilters] = useState(true);
  const { data: family } = useFamily();
  const { stories, loading, error } = useStories();
  const { api } = useAuth();
  const { isUploading, uploadProgress, currentFileName } = useUpload("family");
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openUpload) {
      setIsUploadOpen(true);
      navigate("/stories", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const allTags = useMemo(() => {
    const tags = new Set();
    stories.forEach((story) => {
      (story.tags || []).forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [stories]);

  const filteredStories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return stories.filter((story) => {
      const authorText =
        typeof story.author === "string"
          ? story.author
          : story.author?.name || story.author?.email || "";
      const haystack = [
        story.title,
        story.excerpt,
        authorText,
        ...(story.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesTerm = term ? haystack.includes(term) : true;
      const matchesTags = selectedTags.size
        ? (story.tags || []).some((tag) => selectedTags.has(tag))
        : true;

      return matchesTerm && matchesTags;
    });
  }, [stories, searchTerm, selectedTags]);

  console.log("Filtered Stories:", filteredStories);
  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags(new Set());
  };

  const handleDelete = async (storyId) => {
    if (!storyId) return;
    try {
      await api.delete(`/story/${storyId}`);
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      if (selectedStory?.id === storyId) {
        setIsViewOpen(false);
        setSelectedStory(null);
      }
    } catch (err) {
      console.error("Failed to delete story", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {isUploadOpen && (
        <UploadMemoryModal onClose={() => setIsUploadOpen(false)} />
      )}
      {isViewOpen && (
        <ViewStoryModal
          story={selectedStory}
          onClose={() => {
            setIsViewOpen(false);
            setSelectedStory(null);
          }}
        />
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
              <Input
                placeholder="Search stories..."
                className="pl-10"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="icon">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <List className="h-4 w-4" />
            </Button>
          </div>
          {showFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`cursor-pointer hover:bg-secondary ${
                  selectedTags.size === 0 ? "bg-secondary" : ""
                }`}
                onClick={clearFilters}
              >
                All
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`cursor-pointer hover:bg-secondary ${
                    selectedTags.has(tag) ? "bg-secondary" : ""
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading stories...
          </div>
        ) : family == null ? (
          <div className="flex flex-col items-center py-12 text-center text-lg text-foreground font-display ">
            Join or create a family to start sharing stories.
            <Link
              to="/family"
              className="mt-4 inline-flex items-center justify-center font-medium transition-all bg-[#A65E2E] hover:bg-[#8e4f26] text-white h-12 rounded-md px-8 gap-2 text-base shadow-lg"
            >
              Join or Create a Family
            </Link>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-600">{error}</div>
        ) : stories.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No stories yet. Create your first memory.
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No stories match your filters.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {isUploading && (
                <LoadingStoryCard
                  uploadProgress={uploadProgress}
                  currentFileName={currentFileName}
                />
              )}
            </AnimatePresence>
            {filteredStories.map((story, i) => (
              <StoryCard
                key={story.id}
                {...story}
                index={i}
                onClick={() => {
                  setSelectedStory(story);
                  setIsViewOpen(true);
                }}
                onDelete={() => handleDelete(story.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
