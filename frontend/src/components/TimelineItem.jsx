import React from "react";
import { motion } from "framer-motion";

const themes = {
  spring: {
    label: "Spring Bloom",
    chip: "SPR",
    accent: "#4F8A61",
    soft: "#E8F3E7",
    glaze: "linear-gradient(135deg, #F7FFF4 0%, #EAF6E9 100%)",
    ring: "#B7D6B9",
  },
  summer: {
    label: "Summer Glow",
    chip: "SUM",
    accent: "#D27A1C",
    soft: "#FFF0DA",
    glaze: "linear-gradient(135deg, #FFF7EA 0%, #FFE2BE 100%)",
    ring: "#F1C08D",
  },
  autumn: {
    label: "Autumn Hearth",
    chip: "AUT",
    accent: "#A4492D",
    soft: "#F8E7DC",
    glaze: "linear-gradient(135deg, #FFF4EE 0%, #F2D3C0 100%)",
    ring: "#D9A584",
  },
  winter: {
    label: "Winter Hush",
    chip: "WIN",
    accent: "#3E5C76",
    soft: "#E6EEF6",
    glaze: "linear-gradient(135deg, #F4F8FF 0%, #E2ECF7 100%)",
    ring: "#AFC4DA",
  },
};

const TimelineItem = ({
  year,
  title,
  description,
  season,
  side,
  index,
  onClick,
}) => {
  const theme = themes[season] || themes.spring;
  const alignLeft = side === "left";

  return (
      <div className="relative py-8" onClick={onClick}>
        <div
          className={`relative md:w-1/2 ${
            alignLeft ? "md:pr-12 md:mr-auto" : "md:pl-12 md:ml-auto"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            className="rounded-3xl border px-6 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            style={{
              background: theme.glaze,
              borderColor: theme.ring,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: theme.accent }}
                >
                  {theme.label}
                </p>
                <h3
                  className="mt-2 text-2xl font-semibold"
                  style={{ color: "#3B2316" }}
                >
                  {title}
                </h3>
              </div>
              <div
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: theme.soft,
                  color: theme.accent,
                }}
              >
                {theme.chip} {year}
              </div>
            </div>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "#5E3A22" }}
            >
              {description}
            </p>
          </motion.div>
        </div>

        <div
          className="absolute left-1/2 top-10 hidden -translate-x-1/2 md:block"
          style={{ color: theme.accent }}
        >
          <span
            className="block h-3.5 w-3.5 rounded-full border-2"
            style={{ borderColor: theme.accent, background: theme.soft }}
          />
        </div>
      </div>
  );
};

export default TimelineItem;
