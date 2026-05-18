import React from "react";
import StoryCard from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import { useStories } from "@/hooks/useStories";

const CircleStories = ({ circleId, viewMode = "scrapbook", onAddStory }) => {
  const { stories, loading, error } = useStories(circleId);

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
          <StoryCard {...story} index={index} />
        </div>
      ))}
    </div>
  );
};

export default CircleStories;
