import { Skeleton } from "@/components/ui/skeleton";
import { Folder as FolderIcon } from "lucide-react";
import {
  CATEGORIES,
  type Category,
  type Folder,
  type Movie,
  type NavView,
} from "../types";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  folders: Folder[];
  activeView: NavView;
  isLoading: boolean;
  searchQuery: string;
  genreFilter: string;
  yearFilter: string;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  isAdmin?: boolean;
  allowView?: boolean;
  allowDownload?: boolean;
}

export function MovieGrid({
  movies,
  folders,
  activeView,
  isLoading,
  searchQuery,
  genreFilter,
  yearFilter,
  onEdit,
  onDelete,
  isAdmin = false,
  allowView = true,
  allowDownload = false,
}: MovieGridProps) {
  let filtered = movies;
  if (genreFilter)
    filtered = filtered.filter((m) =>
      m.genre.toLowerCase().includes(genreFilter.toLowerCase()),
    );
  if (yearFilter)
    filtered = filtered.filter((m) => Number(m.year) === Number(yearFilter));

  const cardProps = { isAdmin, allowView, allowDownload };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {[
          "sk1",
          "sk2",
          "sk3",
          "sk4",
          "sk5",
          "sk6",
          "sk7",
          "sk8",
          "sk9",
          "sk10",
        ].map((k) => (
          <div
            key={k}
            className="rounded-xl overflow-hidden"
            data-ocid="movies.loading_state"
          >
            <Skeleton
              className="aspect-[2/3] w-full"
              style={{ background: "#162742" }}
            />
            <Skeleton
              className="h-4 mt-2 mx-3"
              style={{ background: "#162742" }}
            />
            <Skeleton
              className="h-3 mt-1 mx-3 mb-3 w-2/3"
              style={{ background: "#162742" }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Search mode — flat grid with category badges
  if (searchQuery.trim()) {
    if (filtered.length === 0) {
      return (
        <div
          className="flex flex-col items-center justify-center py-20"
          data-ocid="movies.empty_state"
        >
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-semibold" style={{ color: "#E8EEF7" }}>
            No results for "{searchQuery}"
          </p>
          <p className="text-sm mt-1" style={{ color: "#7F8CA3" }}>
            Try a different search term
          </p>
        </div>
      );
    }
    return (
      <div>
        <p className="text-sm mb-4" style={{ color: "#7F8CA3" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((m, i) => (
            <MovieCard
              key={m.id.toString()}
              movie={m}
              showCategory
              onEdit={onEdit}
              onDelete={onDelete}
              index={i + 1}
              {...cardProps}
            />
          ))}
        </div>
      </div>
    );
  }

  // All movies — group by category
  if (activeView === "all") {
    return (
      <div className="space-y-8">
        {CATEGORIES.map((cat) => {
          const catMovies = filtered.filter((m) => m.category === cat);
          if (catMovies.length === 0) return null;
          return (
            <section key={cat}>
              <h2
                className="text-base font-bold mb-3 flex items-center gap-2"
                style={{ color: "#D2B04C" }}
              >
                {cat} Movies
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(210,176,76,0.15)",
                    color: "#AAB6C6",
                  }}
                >
                  {catMovies.length}
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {catMovies.map((m, i) => (
                  <MovieCard
                    key={m.id.toString()}
                    movie={m}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    index={i + 1}
                    {...cardProps}
                  />
                ))}
              </div>
            </section>
          );
        })}
        {filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20"
            data-ocid="movies.empty_state"
          >
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-lg font-semibold" style={{ color: "#E8EEF7" }}>
              No movies yet
            </p>
            <p className="text-sm mt-1" style={{ color: "#7F8CA3" }}>
              Upload your first movie to get started
            </p>
          </div>
        )}
      </div>
    );
  }

  // Category view — group by folder
  const category = activeView as Category;
  const catFolders = folders.filter((f) => f.category === category);
  const unassigned = filtered.filter(
    (m) => !m.folderId || m.folderId.length === 0,
  );

  return (
    <div className="space-y-8">
      {catFolders.map((folder) => {
        const folderMovies = filtered.filter(
          (m) =>
            m.folderId && m.folderId.length > 0 && m.folderId[0] === folder.id,
        );
        return (
          <section key={folder.id.toString()}>
            <h2
              className="text-base font-bold mb-3 flex items-center gap-2"
              style={{ color: "#AAB6C6" }}
            >
              <FolderIcon className="w-4 h-4" style={{ color: "#D2B04C" }} />
              {folder.name}
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(210,176,76,0.15)",
                  color: "#7F8CA3",
                }}
              >
                {folderMovies.length}
              </span>
            </h2>
            {folderMovies.length === 0 ? (
              <p className="text-sm" style={{ color: "#7F8CA3" }}>
                No movies in this folder
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {folderMovies.map((m, i) => (
                  <MovieCard
                    key={m.id.toString()}
                    movie={m}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    index={i + 1}
                    {...cardProps}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {/* Unassigned */}
      <section>
        <h2
          className="text-base font-bold mb-3 flex items-center gap-2"
          style={{ color: "#AAB6C6" }}
        >
          Unassigned
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", color: "#7F8CA3" }}
          >
            {unassigned.length}
          </span>
        </h2>
        {unassigned.length === 0 ? (
          <p className="text-sm" style={{ color: "#7F8CA3" }}>
            All movies are organized in folders
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {unassigned.map((m, i) => (
              <MovieCard
                key={m.id.toString()}
                movie={m}
                onEdit={onEdit}
                onDelete={onDelete}
                index={i + 1}
                {...cardProps}
              />
            ))}
          </div>
        )}
      </section>

      {filtered.length === 0 && catFolders.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20"
          data-ocid="movies.empty_state"
        >
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-lg font-semibold" style={{ color: "#E8EEF7" }}>
            No {category} movies yet
          </p>
          <p className="text-sm mt-1" style={{ color: "#7F8CA3" }}>
            Upload your first movie in this category
          </p>
        </div>
      )}
    </div>
  );
}
