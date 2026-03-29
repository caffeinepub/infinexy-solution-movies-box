import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { Header } from "./components/Header";
import { ManagementPanel } from "./components/ManagementPanel";
import { MovieGrid } from "./components/MovieGrid";
import { Sidebar } from "./components/Sidebar";
import { StatsPanel } from "./components/StatsPanel";
import { UploadModal } from "./components/UploadModal";
import { useAdmin } from "./hooks/useAdmin";
import { useAllMovies, useDeleteMovie, useSeedMovies } from "./hooks/useMovies";
import { CATEGORIES, type Category, type Movie, type NavView } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<NavView>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Admin
  const { isAdmin, permissions, login, logout, setPermission } = useAdmin();
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // Modals
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editMovie, setEditMovie] = useState<Movie | null>(null);

  const { data: movies = [], isLoading: moviesLoading } = useAllMovies();
  const seedMovies = useSeedMovies();
  const deleteMovie = useDeleteMovie();
  const seededRef = useRef(false);

  // Seed on first load
  useEffect(() => {
    if (!moviesLoading && movies.length === 0 && !seededRef.current) {
      seededRef.current = true;
      seedMovies.mutate();
    }
  }, [moviesLoading, movies.length, seedMovies]);

  // Guard management panel — non-admins get redirected and prompted to login
  useEffect(() => {
    if (activeView === "manage" && !isAdmin) {
      setActiveView("all");
      setAdminLoginOpen(true);
    }
  }, [activeView, isAdmin]);

  const viewMovies = searchQuery.trim()
    ? movies.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : activeView === "all"
      ? movies
      : movies.filter((m) => m.category === (activeView as Category));

  const allGenres = Array.from(
    new Set(movies.map((m) => m.genre).filter(Boolean)),
  );
  const allYears = Array.from(new Set(movies.map((m) => Number(m.year)))).sort(
    (a, b) => b - a,
  );

  const handleEditMovie = useCallback((movie: Movie) => {
    setEditMovie(movie);
    setUploadOpen(true);
  }, []);

  const handleDeleteFromGrid = useCallback(
    async (movie: Movie) => {
      if (!window.confirm(`Delete "${movie.title}"?`)) return;
      try {
        await deleteMovie.mutateAsync(movie.id);
        toast.success("Movie deleted");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to delete movie",
        );
      }
    },
    [deleteMovie],
  );

  const currentCategory = CATEGORIES.includes(activeView as Category)
    ? (activeView as Category)
    : undefined;

  const pageTitle =
    activeView === "all"
      ? "All Movies"
      : activeView === "manage"
        ? "Management Panel"
        : `${activeView} Movies`;

  const inputStyle = {
    background: "#111E31",
    borderColor: "#263A55",
    color: "#E8EEF7",
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0B1220" }}
    >
      <Sidebar
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          setSearchQuery("");
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isAdmin={isAdmin}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUploadClick={() => {
            setEditMovie(null);
            setUploadOpen(true);
          }}
          onMenuClick={() => setSidebarOpen(true)}
          isAdmin={isAdmin}
          onAdminLoginClick={() => setAdminLoginOpen(true)}
          onLogout={logout}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeView === "manage" ? (
            <ManagementPanel
              movies={movies}
              isLoading={moviesLoading}
              onEditMovie={handleEditMovie}
              onAddMovie={() => {
                setEditMovie(null);
                setUploadOpen(true);
              }}
              permissions={permissions}
              onSetPermission={setPermission}
            />
          ) : (
            <div className="flex gap-6">
              {/* Main content */}
              <div className="flex-1 min-w-0">
                {/* Page title + filters */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <h1
                    className="text-2xl font-black mr-auto"
                    style={{ color: "#E8EEF7" }}
                  >
                    {searchQuery ? `Search: "${searchQuery}"` : pageTitle}
                  </h1>

                  {!searchQuery && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={genreFilter || "all"}
                        onValueChange={(v) =>
                          setGenreFilter(v === "all" ? "" : v)
                        }
                      >
                        <SelectTrigger
                          className="w-32 h-8 text-xs"
                          style={inputStyle}
                          data-ocid="filter.genre.select"
                        >
                          <SelectValue placeholder="Genre" />
                        </SelectTrigger>
                        <SelectContent
                          style={{
                            background: "#162742",
                            borderColor: "#263A55",
                          }}
                        >
                          <SelectItem value="all" style={{ color: "#AAB6C6" }}>
                            All Genres
                          </SelectItem>
                          {allGenres.map((g) => (
                            <SelectItem
                              key={g}
                              value={g}
                              style={{ color: "#E8EEF7" }}
                            >
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={yearFilter || "all"}
                        onValueChange={(v) =>
                          setYearFilter(v === "all" ? "" : v)
                        }
                      >
                        <SelectTrigger
                          className="w-28 h-8 text-xs"
                          style={inputStyle}
                          data-ocid="filter.year.select"
                        >
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent
                          style={{
                            background: "#162742",
                            borderColor: "#263A55",
                          }}
                        >
                          <SelectItem value="all" style={{ color: "#AAB6C6" }}>
                            All Years
                          </SelectItem>
                          {allYears.map((y) => (
                            <SelectItem
                              key={y}
                              value={String(y)}
                              style={{ color: "#E8EEF7" }}
                            >
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <MovieGrid
                  movies={viewMovies}
                  folders={[]}
                  activeView={searchQuery ? "all" : activeView}
                  isLoading={moviesLoading}
                  searchQuery={searchQuery}
                  genreFilter={genreFilter}
                  yearFilter={yearFilter}
                  onEdit={handleEditMovie}
                  onDelete={handleDeleteFromGrid}
                  isAdmin={isAdmin}
                  allowView={permissions.allowView}
                  allowDownload={permissions.allowDownload}
                />
              </div>

              {/* Stats panel */}
              <aside className="hidden xl:block w-56 shrink-0">
                <StatsPanel movies={movies} />
              </aside>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <UploadModal
        open={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          setEditMovie(null);
        }}
        editMovie={editMovie}
        defaultCategory={currentCategory}
      />

      <AdminLoginModal
        open={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLogin={login}
      />

      <Toaster richColors position="bottom-right" />
    </div>
  );
}
