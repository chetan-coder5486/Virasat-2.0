import React, { useEffect, useMemo, useState } from "react";
import { Clock, Loader2, Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import CreateCircleModal from "@/components/CreateCircleModal";
import { UploadMemoryModal } from "@/components/UploadMemoryModal";
import CircleStories from "@/components/CircleStories";
import ViewCircleMembers from "@/components/ViewCircleMembers";
import { useCircles } from "@/hooks/useCircles";
import { useFamily } from "@/hooks/useFamily";
import { useUpload } from "@/context/UploadContext";
import { Link } from "react-router";

const Circles = () => {
  const { data: circles = [], isPending, error } = useCircles();
  const { data: family = [] } = useFamily();
  const [activeCircleId, setActiveCircleId] = useState(null);
  const [viewMode, setViewMode] = useState("scrapbook");
  const [showMembers, setShowMembers] = useState(false);
  const [showCreateCircle, setShowCreateCircle] = useState(false);
  const [showUploadMemory, setShowUploadMemory] = useState(false);
  const { isUploading, uploadProgress, currentFileName } = useUpload();
  const normalizedCircles = Array.isArray(circles) ? circles : [];
  const circlePalette = [
    "bg-emerald-500",
    "bg-amber-500",
    "bg-indigo-500",
    "bg-rose-500",
    "bg-sky-500",
  ];

  const getCircleId = (circle) => circle?._id || circle?.id;

  useEffect(() => {
    if (!activeCircleId && normalizedCircles.length > 0) {
      setActiveCircleId(getCircleId(normalizedCircles[0]));
      return;
    }

    if (
      activeCircleId &&
      !normalizedCircles.some(
        (circle) => getCircleId(circle) === activeCircleId,
      )
    ) {
      setActiveCircleId(getCircleId(normalizedCircles[0]));
    }
  }, [activeCircleId, normalizedCircles]);

  useEffect(() => {
    setShowMembers(false);
  }, [activeCircleId]);

  const activeCircle = useMemo(
    () =>
      normalizedCircles.find(
        (circle) => getCircleId(circle) === activeCircleId,
      ),
    [activeCircleId, normalizedCircles],
  );

  const hasCircles = normalizedCircles.length > 0;
  const activeMemberCount =
    activeCircle?.members?.length ?? activeCircle?.membersCount ?? 0;
  const activeCircleName = activeCircle?.name || null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#e9eff1]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6">
          <div className="rounded-[28px] border border-border bg-background/70 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur">
            {family == null || family.length === 0 ? (
              <div className="flex min-h-[75vh] items-center justify-center px-6">
                <div className="max-w-md text-center">
                  <p className="text-lg font-semibold text-foreground">
                    Join a family to start creating circles.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Circles are where you share and organize family memories.
                  </p>
                  <Link
                    to="/family"
                    className="mt-4 inline-flex items-center justify-center font-medium transition-all bg-[#A65E2E] hover:bg-[#8e4f26] text-white h-12 rounded-md px-8 gap-2 text-base shadow-lg"
                  >
                    Join or Create a Family
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid min-h-[75vh] grid-cols-1 overflow-hidden lg:grid-cols-[340px_1fr]">
                {isPending ? (
                  <div className="flex h-full items-center justify-center px-6">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Loading circles...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
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
                          onClick={() => setShowCreateCircle(true)}
                        >
                          <Plus />
                        </Button>
                      </div>

                      <div className="px-5 pt-4">
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search circles"
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex-1 space-y-2 overflow-y-auto px-3 pb-6">
                        {error && (
                          <p className="px-2 text-sm text-red-600">
                            {error?.response?.data?.message ||
                              "Failed to load circles."}
                          </p>
                        )}

                        {!hasCircles && (
                          <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-6 text-center">
                            <p className="text-sm font-semibold text-foreground">
                              You are not part of any circle yet.
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Create a circle to begin sharing family memories.
                            </p>
                            <Button
                              className="mt-4"
                              onClick={() => setShowCreateCircle(true)}
                            >
                              Create Circle
                            </Button>
                          </div>
                        )}

                        {normalizedCircles.map((circle, index) => {
                          const circleId = getCircleId(circle);
                          const memberCount =
                            circle.members?.length ?? circle.membersCount ?? 0;
                          const lastActive = circle.updatedAt
                            ? new Date(circle.updatedAt).toLocaleDateString(
                                "en-IN",
                                {
                                  dateStyle: "medium",
                                },
                              )
                            : "Recently";
                          const unreadCount = circle.unread || 0;
                          const theme =
                            circlePalette[index % circlePalette.length];

                          return (
                            <button
                              key={circleId}
                              type="button"
                              onClick={() => setActiveCircleId(circleId)}
                              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                                activeCircleId === circleId
                                  ? "border-emerald-400 bg-emerald-50"
                                  : "border-transparent bg-white hover:border-border"
                              }`}
                            >
                              <div
                                className={`h-12 w-12 shrink-0 rounded-2xl ${theme} flex items-center justify-center text-sm font-semibold text-white`}
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
                                  {unreadCount > 0 && (
                                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                                      {unreadCount}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                  <Users className="h-3.5 w-3.5" />
                                  <span>{memberCount} members</span>
                                  <span className="text-border">•</span>
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{lastActive}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
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
                                {activeMemberCount} members, memories across
                                decades
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant={
                                  viewMode === "scrapbook"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setViewMode("scrapbook")}
                              >
                                Scrapbook
                              </Button>
                              <Button
                                variant={
                                  viewMode === "timeline"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setViewMode("timeline")}
                              >
                                Timeline
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowUploadMemory(true)}
                              >
                                Share Story
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowMembers((prev) => !prev)}
                              >
                                {showMembers ? "View Stories" : "View Members"}
                              </Button>
                            </div>
                          </div>

                          <div className="flex-1 px-6 py-6">
                            {showMembers ? (
                              <ViewCircleMembers circleId={activeCircleId} />
                            ) : (
                              <>
                                <div className="mb-6 rounded-2xl border border-border bg-white/90 px-5 py-4">
                                  <p className="text-sm font-semibold text-foreground">
                                    This day in your family history
                                  </p>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    3 years ago, Grandma Ruth shared "Dad's
                                    First Car".
                                  </p>
                                </div>
                                <CircleStories
                                  circleId={activeCircleId}
                                  viewMode={viewMode}
                                  onAddStory={() => setShowUploadMemory(true)}
                                />
                              </>
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
                              Circles keep family stories organized by branch,
                              city, or tradition.
                            </p>
                            <Button
                              className="mt-4"
                              onClick={() => setShowCreateCircle(true)}
                            >
                              Create Circle
                            </Button>
                          </div>
                        </div>
                      )}
                    </section>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showCreateCircle ? (
        <CreateCircleModal onClose={() => setShowCreateCircle(false)} />
      ) : null}
      {showUploadMemory ? (
        <UploadMemoryModal
          onClose={() => setShowUploadMemory(false)}
          circleId={activeCircleId}
          circleName={activeCircleName}
        />
      ) : null}
    </>
  );
};

export default Circles;
