import React, { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Heart,
  Image,
  MessageCircle,
  Mic,
  Plus,
  Search,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const circlesSeed = [
  {
    id: "heritage",
    name: "Virasat Heritage",
    members: 12,
    lastActive: "2 hours ago",
    unread: 4,
    theme: "bg-emerald-500",
  },
  {
    id: "jaipur",
    name: "Jaipur Roots",
    members: 7,
    lastActive: "yesterday",
    unread: 0,
    theme: "bg-amber-500",
  },
  {
    id: "diaspora",
    name: "Diaspora Diaries",
    members: 5,
    lastActive: "3 days ago",
    unread: 1,
    theme: "bg-indigo-500",
  },
];

const storiesSeed = [
  {
    id: "s1",
    circleId: "heritage",
    title: "Dad's First Car",
    date: "1965",
    author: "Grandma Ruth",
    excerpt:
      "A mint green Ambassador that started every Sunday without fail, even after long monsoons.",
    tags: ["Road Trip", "Family"],
    likes: 18,
    comments: 6,
    type: "photo",
    media:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "s2",
    circleId: "heritage",
    title: "The Old Courtyard",
    date: "1959",
    author: "Aunt Leena",
    excerpt:
      "Where the entire family gathered for winter feasts and endless card games.",
    tags: ["Home", "Tradition"],
    likes: 26,
    comments: 11,
    type: "written",
    media:
      "https://images.unsplash.com/photo-1475856034135-706a1f5ff1c1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "s3",
    circleId: "heritage",
    title: "Wedding Song Recordings",
    date: "1978",
    author: "Uncle Pritam",
    excerpt:
      "A cassette of the women singing in the courtyard while the rain rolled in.",
    tags: ["Music", "Wedding"],
    likes: 14,
    comments: 3,
    type: "audio",
    media:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "s4",
    circleId: "jaipur",
    title: "Pink City Sunset",
    date: "1984",
    author: "Riya",
    excerpt:
      "A diary note about the rooftops glowing while the city slowed down.",
    tags: ["City", "Travel"],
    likes: 10,
    comments: 2,
    type: "photo",
    media:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "s5",
    circleId: "diaspora",
    title: "Letters From Nairobi",
    date: "1992",
    author: "Nani",
    excerpt:
      "Postcards describing the first family store overseas and the neighbors who helped.",
    tags: ["Letters", "Migration"],
    likes: 22,
    comments: 5,
    type: "written",
    media:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1200&auto=format&fit=crop",
  },
];

const storyTypeMeta = {
  photo: { label: "Photo story", icon: Image },
  video: { label: "Video memory", icon: Video },
  written: { label: "Written story", icon: FileText },
  audio: { label: "Audio recording", icon: Mic },
};

const formatStoryDate = (value) => {
  if (!value) return "";
  if (/^\d{4}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-IN", { dateStyle: "long" });
};

const Circles = () => {
  const [activeCircleId, setActiveCircleId] = useState(
    circlesSeed[0]?.id ?? null,
  );
  const [viewMode, setViewMode] = useState("scrapbook");

  const activeCircle = useMemo(
    () => circlesSeed.find((circle) => circle.id === activeCircleId),
    [activeCircleId],
  );

  const circleStories = useMemo(
    () => storiesSeed.filter((story) => story.circleId === activeCircleId),
    [activeCircleId],
  );

  const hasCircles = circlesSeed.length > 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#e9eff1]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6">
          <div className="rounded-[28px] border border-border bg-background/70 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="grid min-h-[75vh] grid-cols-1 overflow-hidden lg:grid-cols-[340px_1fr]">
              <aside className="flex h-full flex-col border-b border-border bg-[#f6f8f7] lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Circles
                    </p>
                    <h1 className="text-lg font-semibold text-foreground">
                      Your Circles
                    </h1>
                  </div>
                  <Button
                    size="icon"
                    className="bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="px-5 pt-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search circles" className="pl-9" />
                  </div>
                </div>

                <div className="mt-4 flex-1 space-y-2 overflow-y-auto px-3 pb-6">
                  {!hasCircles && (
                    <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-6 text-center">
                      <p className="text-sm font-semibold text-foreground">
                        You are not part of any circle yet.
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Create a circle to begin sharing family memories.
                      </p>
                      <Button className="mt-4">Create Circle</Button>
                    </div>
                  )}

                  {circlesSeed.map((circle) => (
                    <button
                      key={circle.id}
                      type="button"
                      onClick={() => setActiveCircleId(circle.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                        activeCircleId === circle.id
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-transparent bg-white hover:border-border"
                      }`}
                    >
                      <div
                        className={`h-12 w-12 shrink-0 rounded-2xl ${circle.theme} flex items-center justify-center text-sm font-semibold text-white`}
                      >
                        {circle.name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">
                            {circle.name}
                          </p>
                          {circle.unread > 0 && (
                            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                              {circle.unread}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span>{circle.members} members</span>
                          <span className="text-border">•</span>
                          <Clock className="h-3.5 w-3.5" />
                          <span>{circle.lastActive}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="flex min-h-[70vh] flex-col bg-[radial-gradient(circle_at_top,#fefcf6,transparent_60%)]">
                {activeCircle ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-white/80 px-6 py-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Active Circle
                        </p>
                        <h2 className="text-xl font-semibold text-foreground">
                          {activeCircle.name}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {activeCircle.members} members, memories across
                          decades
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={
                            viewMode === "scrapbook" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setViewMode("scrapbook")}
                        >
                          Scrapbook
                        </Button>
                        <Button
                          variant={
                            viewMode === "timeline" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setViewMode("timeline")}
                        >
                          Timeline
                        </Button>
                        <Button variant="outline" size="sm">
                          Share Story
                        </Button>
                      </div>
                    </div>

                    <div className="px-6 pt-5">
                      <div className="rounded-2xl border border-border bg-white/90 px-5 py-4">
                        <p className="text-sm font-semibold text-foreground">
                          This day in your family history
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          3 years ago, Grandma Ruth shared "Dad's First Car".
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 px-6 py-6">
                      {circleStories.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <div className="max-w-sm text-center">
                            <p className="text-lg font-semibold text-foreground">
                              No stories in this circle yet.
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Be the first to add a memory and start the family
                              scrapbook.
                            </p>
                            <Button className="mt-4">Add Story</Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`gap-5 ${
                            viewMode === "scrapbook"
                              ? "columns-1 md:columns-2 xl:columns-3"
                              : "grid grid-cols-1"
                          }`}
                        >
                          {circleStories.map((story, index) => {
                            const typeMeta =
                              storyTypeMeta[story.type] || storyTypeMeta.photo;
                            const TypeIcon = typeMeta.icon;

                            return (
                              <article
                                key={story.id}
                                className={`mb-5 break-inside-avoid overflow-hidden rounded-3xl border border-border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1 ${
                                  viewMode === "timeline"
                                    ? "flex flex-col md:flex-row"
                                    : ""
                                }`}
                              >
                                <div
                                  className={`relative ${
                                    viewMode === "timeline"
                                      ? "h-56 w-full md:h-auto md:w-2/5"
                                      : "h-48"
                                  }`}
                                >
                                  <img
                                    src={story.media}
                                    alt={story.title}
                                    className="h-full w-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
                                    {typeMeta.label}
                                  </div>
                                </div>
                                <div className="flex flex-1 flex-col px-5 py-5">
                                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{formatStoryDate(story.date)}</span>
                                    <span className="text-border">•</span>
                                    <span>Shared by {story.author}</span>
                                    <span className="text-border">•</span>
                                    <TypeIcon className="h-3.5 w-3.5" />
                                  </div>
                                  <h3 className="text-lg font-semibold text-foreground">
                                    {story.title}
                                  </h3>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    {story.excerpt}
                                  </p>
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {story.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-[11px]"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Heart className="h-3.5 w-3.5" />
                                      {story.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageCircle className="h-3.5 w-3.5" />
                                      {story.comments}
                                    </span>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center px-6">
                    <div className="max-w-md text-center">
                      <p className="text-lg font-semibold text-foreground">
                        Create your first circle.
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Circles keep family stories organized by branch, city,
                        or tradition.
                      </p>
                      <Button className="mt-4">Create Circle</Button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Circles;
