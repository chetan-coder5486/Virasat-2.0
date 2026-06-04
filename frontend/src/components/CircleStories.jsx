import React, { useState } from "react";
import StoryCard from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import { useStories } from "@/hooks/useStories";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const CircleStories = ({ circleId, viewMode = "scrapbook", onAddStory }) => {
  const { stories, loading, error } = useStories(circleId, {
    enabled: Boolean(circleId),
  });
  const {api} = useAuth();
  const queryClient = useQueryClient();
  const [selectedStory, setSelectedStory] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const handleDelete = async (storyId) => {
    if (!storyId) return;
    try {
      await api.delete(`/story/${storyId}`);
      queryClient.invalidateQueries({ queryKey: ["stories", circleId ?? "family"] });
      if (selectedStory?.id === storyId) {
        setIsViewOpen(false);
        setSelectedStory(null);
      }
      toast.success("Story deleted successfully");
    } catch (err) {
      console.error("Failed to delete story", err);
      toast.error("Failed to delete story");
    }
  };

  if (!circleId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-sm text-center">
          <p className="text-lg font-semibold text-foreground">
            Select a circle to view stories.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-sm text-center">
          <p className="text-lg font-semibold text-foreground">
            No stories in this circle yet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first to add a memory and start the family scrapbook.
          </p>
          {onAddStory ? (
            <Button className="mt-4" onClick={onAddStory}>
              Add Story
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`gap-5 ${
        viewMode === "scrapbook"
          ? "columns-1 md:columns-2 xl:columns-3"
          : "grid grid-cols-1"
      }`}
    >
      {stories.map((story, index) => (
        <div
          key={story.id}
          className={viewMode === "scrapbook" ? "mb-5 break-inside-avoid" : ""}
        >
          <StoryCard
            {...story}
            index={index}
            onDelete={() => handleDelete(story.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default CircleStories;
