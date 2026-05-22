import React from "react";
import { useCircles } from "@/hooks/useCircles";

const ViewCircleMembers = ({ circleId }) => {
  const { data: circles = [] } = useCircles();
  const circle = circles.find((c) => c._id === circleId);

  if (!circle) {
    return (
      <div className="p-4">
        <h2 className="mb-2 text-xl font-semibold">Circle not found</h2>
        <p className="text-gray-600">
          The circle you are looking for does not exist.
        </p>
      </div>
    );
  }

  const members = Array.isArray(circle.members) ? circle.members : [];

  return (
    <div className="p-4">
      <p className="text-sm font-semibold text-foreground">
        {members.length} member{members.length === 1 ? "" : "s"}
      </p>
      <ul className="mt-3 space-y-2">
        {members.map((member) => {
          const name = member?.name || "Unknown";
          const email = member?.email || "";
          const avatar = member?.avatar || "";
          const initials = name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <li
              key={member?._id || `${name}-${email}`}
              className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-border"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
                {avatar ? (
                  <img src={avatar} alt={name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {name}
                </p>
                {email ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {email}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ViewCircleMembers;
