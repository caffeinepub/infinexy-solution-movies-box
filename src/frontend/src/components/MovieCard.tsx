import { Download, Edit2, ExternalLink, Trash2 } from "lucide-react";
import { CATEGORY_COLORS, type Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
  showCategory?: boolean;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  index?: number;
  isAdmin?: boolean;
  allowView?: boolean;
  allowDownload?: boolean;
}

export function MovieCard({
  movie,
  showCategory,
  onEdit,
  onDelete,
  index = 1,
  isAdmin = false,
  allowView = true,
  allowDownload = false,
}: MovieCardProps) {
  const year = Number(movie.year);

  const canView = allowView || isAdmin;
  const canDownload = allowDownload || isAdmin;

  return (
    <div
      className="group relative rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
      style={{ background: "#121F33", border: "1px solid #22324A" }}
      data-ocid={`movies.item.${index}`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{
              background: `linear-gradient(135deg, #121F33 0%, ${CATEGORY_COLORS[movie.category]}33 100%)`,
            }}
          >
            🎬
          </div>
        )}
        {/* Category badge */}
        {showCategory && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
            style={{
              background: CATEGORY_COLORS[movie.category],
              color: "#fff",
            }}
          >
            {movie.category}
          </div>
        )}
        {/* Year badge */}
        <div
          className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold"
          style={{ background: "rgba(0,0,0,0.7)", color: "#D2B04C" }}
        >
          {year}
        </div>
        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {/* Edit — admin only */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onEdit(movie)}
              className="p-2.5 rounded-lg font-semibold text-xs uppercase transition-colors"
              style={{ background: "#D2B04C", color: "#0B1220" }}
              data-ocid={`movies.edit_button.${index}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {/* View */}
          {canView && movie.videoLink && (
            <a
              href={movie.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.15)", color: "#E8EEF7" }}
              title="Watch"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Download */}
          {canDownload && movie.videoLink && (
            <a
              href={movie.videoLink}
              download
              className="p-2.5 rounded-lg transition-colors"
              style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e" }}
              title="Download"
              data-ocid={`movies.download_button.${index}`}
            >
              <Download className="w-4 h-4" />
            </a>
          )}

          {/* Delete — admin only */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onDelete(movie)}
              className="p-2.5 rounded-lg transition-colors"
              style={{ background: "#B53A3A", color: "#fff" }}
              data-ocid={`movies.delete_button.${index}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3
          className="font-bold text-sm leading-tight mb-1 line-clamp-2"
          style={{ color: "#E8EEF7" }}
        >
          {movie.title}
        </h3>
        <p className="text-xs" style={{ color: "#7F8CA3" }}>
          {movie.genre}
        </p>
      </div>
    </div>
  );
}
