import Navbar from "@/components/Navbar";
import TimelineItem from "@/components/TimelineItem";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useTimelineStories } from "@/hooks/useTImelineStories";

const seasonThemes = {
  spring: {
    page: "#F7FFF4",
    hero: "#2F3C2F",
    glow: "#9BC59D",
    ink: "#EAF6E9",
    backdrop:
      "radial-gradient(circle at 20% 18%, rgba(155,197,157,0.35), transparent 55%), radial-gradient(circle at 80% 12%, rgba(255,255,255,0.7), transparent 45%)",
    texture:
      "repeating-linear-gradient(120deg, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 2px, transparent 2px, transparent 10px)",
    particle: "rgba(155,197,157,0.45)",
  },
  summer: {
    page: "#FFF8EC",
    hero: "#3D2A12",
    glow: "#F2B678",
    ink: "#FFF1DA",
    backdrop:
      "radial-gradient(circle at 85% 18%, rgba(242,182,120,0.55), transparent 40%), radial-gradient(circle at 15% 75%, rgba(255,241,218,0.65), transparent 55%)",
    texture:
      "repeating-linear-gradient(95deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 3px, transparent 3px, transparent 18px)",
    particle: "rgba(242,182,120,0.5)",
  },
  autumn: {
    page: "#FFF4EE",
    hero: "#3C2317",
    glow: "#D79B7B",
    ink: "#F8E7DC",
    backdrop:
      "radial-gradient(circle at 15% 20%, rgba(215,155,123,0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,230,210,0.6), transparent 55%)",
    texture:
      "repeating-linear-gradient(135deg, rgba(164,73,45,0.08) 0, rgba(164,73,45,0.08) 2px, transparent 2px, transparent 14px)",
    particle: "rgba(167,93,63,0.45)",
  },
  winter: {
    page: "#F4F8FF",
    hero: "#1E2E3D",
    glow: "#A8BBD2",
    ink: "#E6EEF6",
    backdrop:
      "radial-gradient(circle at 75% 15%, rgba(168,187,210,0.45), transparent 45%), radial-gradient(circle at 20% 70%, rgba(255,255,255,0.7), transparent 55%)",
    texture:
      "repeating-linear-gradient(60deg, rgba(255,255,255,0.35) 0, rgba(255,255,255,0.35) 1px, transparent 1px, transparent 12px)",
    particle: "rgba(255,255,255,0.75)",
  },
  default: {
    page: "#FFFAF5",
    hero: "#2C1A0E",
    glow: "#D4956A",
    ink: "#FDF6EE",
    backdrop:
      "radial-gradient(circle at 18% 20%, rgba(212,149,106,0.28), transparent 55%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.6), transparent 50%)",
    texture:
      "repeating-linear-gradient(120deg, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 2px, transparent 2px, transparent 12px)",
    particle: "rgba(212,149,106,0.35)",
  },
};

const particleConfig = {
  spring: [
    { x: "8%", y: "18%", size: 6, duration: 18, delay: 0 },
    { x: "22%", y: "40%", size: 4, duration: 22, delay: 2 },
    { x: "35%", y: "65%", size: 5, duration: 20, delay: 1 },
    { x: "62%", y: "28%", size: 4, duration: 19, delay: 3 },
    { x: "78%", y: "55%", size: 6, duration: 24, delay: 1.5 },
    { x: "90%", y: "30%", size: 5, duration: 21, delay: 2.5 },
  ],
  summer: [
    { x: "12%", y: "22%", size: 5, duration: 16, delay: 0 },
    { x: "28%", y: "58%", size: 6, duration: 20, delay: 1.5 },
    { x: "44%", y: "30%", size: 4, duration: 18, delay: 2 },
    { x: "63%", y: "42%", size: 5, duration: 19, delay: 0.8 },
    { x: "76%", y: "70%", size: 4, duration: 21, delay: 1.2 },
    { x: "88%", y: "38%", size: 6, duration: 17, delay: 2.2 },
  ],
  autumn: [
    { x: "10%", y: "25%", size: 5, duration: 22, delay: 0 },
    { x: "26%", y: "60%", size: 6, duration: 26, delay: 1.2 },
    { x: "42%", y: "38%", size: 4, duration: 20, delay: 2 },
    { x: "60%", y: "20%", size: 5, duration: 24, delay: 1.5 },
    { x: "74%", y: "62%", size: 6, duration: 28, delay: 0.6 },
    { x: "88%", y: "45%", size: 4, duration: 22, delay: 2.4 },
  ],
  winter: [
    { x: "14%", y: "20%", size: 4, duration: 20, delay: 0 },
    { x: "30%", y: "50%", size: 5, duration: 24, delay: 1.5 },
    { x: "46%", y: "32%", size: 4, duration: 22, delay: 2.2 },
    { x: "62%", y: "60%", size: 5, duration: 26, delay: 0.9 },
    { x: "78%", y: "40%", size: 4, duration: 23, delay: 1.7 },
    { x: "90%", y: "68%", size: 5, duration: 25, delay: 2.5 },
  ],
  default: [
    { x: "18%", y: "30%", size: 4, duration: 20, delay: 0 },
    { x: "32%", y: "55%", size: 5, duration: 22, delay: 1.3 },
    { x: "48%", y: "28%", size: 4, duration: 19, delay: 2 },
    { x: "66%", y: "46%", size: 5, duration: 24, delay: 0.7 },
    { x: "82%", y: "62%", size: 4, duration: 21, delay: 1.8 },
    { x: "92%", y: "36%", size: 5, duration: 23, delay: 2.6 },
  ],
};

export default function Timeline() {
  const [search, setSearch] = useState("");
  const [activeSeason, setActiveSeason] = useState(null);
  const {
    stories: timelineStories,
    loading,
    error,
  } = useTimelineStories();

  const activeTheme = seasonThemes[activeSeason] || seasonThemes.default;

  const filtered = useMemo(() => {
    return timelineStories.filter((e) => {
      const matchSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.year.includes(search);
      const matchSeason = !activeSeason || e.season === activeSeason;
      return matchSearch && matchSeason;
    });
  }, [search, activeSeason, timelineStories]);

  const seasons = ["spring", "summer", "autumn", "winter"];

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: activeTheme.page,
        fontFamily: "'EB Garamond', Georgia, serif",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: `${activeTheme.backdrop}, ${activeTheme.texture}`,
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        {(particleConfig[activeSeason] || particleConfig.default).map(
          (particle, index) => (
            <motion.span
              key={`${activeSeason || "default"}-particle-${index}`}
              className="absolute rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                background: activeTheme.particle,
                filter: "blur(0.5px)",
              }}
              animate={{
                y: [0, -18, 6, -12, 0],
                x: [0, 10, -6, 8, 0],
                opacity: [0.2, 0.6, 0.4, 0.7, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ),
        )}
      </div>
      <Navbar />

      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: activeTheme.hero,
          paddingTop: "5rem",
          paddingBottom: "4rem",
        }}
      >
        {/* Decorative rings */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
          {[400, 600, 800].map((s) => (
            <div
              key={s}
              className="absolute rounded-full border"
              style={{
                width: s,
                height: s,
                borderColor: activeTheme.glow,
                borderWidth: "0.5px",
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-sm uppercase tracking-[0.25em]"
            style={{
              color: activeTheme.glow,
              fontFamily: "'EB Garamond', Georgia, serif",
            }}
          >
            A Living Record
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 text-5xl font-bold leading-tight"
            style={{
              color: activeTheme.ink,
              fontFamily: "'Playfair Display', Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            The Family Timeline
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg leading-relaxed"
            style={{ color: activeTheme.glow }}
          >
            Every year holds a story. Every story holds a life.
          </motion.p>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{
          background: "rgba(255,250,245,0.95)",
          backdropFilter: "blur(8px)",
          borderColor: "#E8D5C0",
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: "#A67C5B" }}
            />
            <Input
              placeholder="Search memories…"
              className="pl-9 border-0 bg-transparent text-sm"
              style={{
                color: "#4A2C14",
                fontFamily: "'EB Garamond', Georgia, serif",
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {seasons.map((s) => {
              const icons = {
                spring: "🌸",
                summer: "☀️",
                autumn: "🍂",
                winter: "❄️",
              };
              return (
                <button
                  key={s}
                  onClick={() => setActiveSeason(activeSeason === s ? null : s)}
                  className="rounded-full px-3 py-1 text-xs capitalize transition-all"
                  style={{
                    background: activeSeason === s ? "#A65E2E" : "#F0E6D9",
                    color: activeSeason === s ? "#FDF6EE" : "#7A4A28",
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "13px",
                  }}
                >
                  {icons[s]} {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="relative">
          {/* Center line */}
          <div
            className="absolute left-1/2 top-0 h-full -translate-x-1/2"
            style={{
              width: "1px",
              background:
                "linear-gradient(to bottom, transparent, #D4956A 8%, #D4956A 92%, transparent)",
            }}
          />

          <div className="flex flex-col gap-0">
            {filtered.map((event, i) => (
              <TimelineItem
                key={event.id || `${event.year}-${event.title}-${i}`}
                {...event}
                side={i % 2 === 0 ? "left" : "right"}
                index={i}
              />
            ))}
          </div>

          {loading && (
            <div className="py-16 text-center" style={{ color: "#C4A882" }}>
              <p style={{ fontSize: "18px" }}>Loading timeline stories...</p>
            </div>
          )}

          {error && !loading && (
            <div className="py-16 text-center" style={{ color: "#C4A882" }}>
              <p style={{ fontSize: "18px" }}>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="py-24 text-center" style={{ color: "#C4A882" }}>
              <p style={{ fontSize: "18px" }}>
                No memories found for that search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
