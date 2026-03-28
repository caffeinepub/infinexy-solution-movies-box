import { Clock, Film } from "lucide-react";
import { CATEGORIES, CATEGORY_COLORS, type Movie } from "../types";

interface StatsPanelProps {
  movies: Movie[];
}

export function StatsPanel({ movies }: StatsPanelProps) {
  const recent = [...movies]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-4 w-full">
      {/* Total */}
      <div
        className="rounded-xl p-4"
        style={{ background: "#121F33", border: "1px solid #22324A" }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <Film className="w-4 h-4" style={{ color: "#D2B04C" }} />
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#7F8CA3" }}
          >
            Total Movies
          </p>
        </div>
        <p className="text-4xl font-black" style={{ color: "#D2B04C" }}>
          {movies.length}
        </p>
      </div>

      {/* By Category */}
      <div
        className="rounded-xl p-4"
        style={{ background: "#121F33", border: "1px solid #22324A" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-3"
          style={{ color: "#7F8CA3" }}
        >
          By Category
        </p>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const count = movies.filter((m) => m.category === cat).length;
            const pct = movies.length > 0 ? (count / movies.length) * 100 : 0;
            return (
              <div key={cat}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "#AAB6C6" }}>
                    {cat}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#E8EEF7" }}
                  >
                    {count}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full"
                  style={{ background: "#22324A" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: CATEGORY_COLORS[cat],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Additions */}
      <div
        className="rounded-xl p-4"
        style={{ background: "#121F33", border: "1px solid #22324A" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" style={{ color: "#D2B04C" }} />
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#7F8CA3" }}
          >
            Recent Additions
          </p>
        </div>
        {recent.length === 0 ? (
          <p className="text-xs" style={{ color: "#7F8CA3" }}>
            No movies yet
          </p>
        ) : (
          <div className="space-y-2">
            {recent.map((m) => (
              <div key={m.id.toString()} className="flex items-center gap-2.5">
                <div
                  className="w-8 h-10 rounded flex items-center justify-center text-sm shrink-0 overflow-hidden"
                  style={{ background: "#162742" }}
                >
                  {m.posterUrl ? (
                    <img
                      src={m.posterUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "🎬"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: "#E8EEF7" }}
                  >
                    {m.title}
                  </p>
                  <p className="text-[11px]" style={{ color: "#7F8CA3" }}>
                    {m.category} · {Number(m.year)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
