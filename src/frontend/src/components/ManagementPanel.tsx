import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Edit2,
  Eye,
  Loader2,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteMovie } from "../hooks/useMovies";
import { CATEGORY_COLORS, type Movie } from "../types";

interface Permissions {
  allowView: boolean;
  allowDownload: boolean;
}

interface ManagementPanelProps {
  movies: Movie[];
  isLoading: boolean;
  onEditMovie: (movie: Movie) => void;
  onAddMovie: () => void;
  permissions: Permissions;
  onSetPermission: (key: "allowView" | "allowDownload", val: boolean) => void;
}

export function ManagementPanel({
  movies,
  isLoading,
  onEditMovie,
  onAddMovie,
  permissions,
  onSetPermission,
}: ManagementPanelProps) {
  const [movieSearch, setMovieSearch] = useState("");
  const deleteMovie = useDeleteMovie();

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(movieSearch.toLowerCase()),
  );

  const handleDeleteMovie = async (movie: Movie) => {
    if (!confirm(`Delete "${movie.title}"?`)) return;
    try {
      await deleteMovie.mutateAsync(movie.id);
      toast.success("Movie deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete movie",
      );
    }
  };

  const surfaceStyle = { background: "#121F33", border: "1px solid #22324A" };
  const inputStyle = {
    background: "#111E31",
    borderColor: "#263A55",
    color: "#E8EEF7",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black" style={{ color: "#E8EEF7" }}>
          Management Panel
        </h1>
      </div>

      <Tabs defaultValue="movies" data-ocid="manage.tab">
        <TabsList style={{ background: "#162742" }}>
          <TabsTrigger
            value="movies"
            style={{ color: "#AAB6C6" }}
            data-ocid="manage.movies.tab"
          >
            Movies ({movies.length})
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            style={{ color: "#AAB6C6" }}
            data-ocid="manage.settings.tab"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movies" className="mt-4">
          <div className="rounded-xl overflow-hidden" style={surfaceStyle}>
            <div
              className="flex items-center gap-3 p-4"
              style={{ borderBottom: "1px solid #22324A" }}
            >
              <Input
                placeholder="Search movies…"
                value={movieSearch}
                onChange={(e) => setMovieSearch(e.target.value)}
                style={inputStyle}
                className="max-w-xs"
                data-ocid="manage.search_input"
              />
              <Button
                onClick={onAddMovie}
                className="ml-auto font-semibold"
                style={{ background: "#D2B04C", color: "#0B1220" }}
                data-ocid="manage.movies.primary_button"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" /> Add Movie
              </Button>
            </div>

            {isLoading ? (
              <div
                className="flex justify-center py-12"
                data-ocid="manage.loading_state"
              >
                <Loader2
                  className="w-6 h-6 animate-spin"
                  style={{ color: "#D2B04C" }}
                />
              </div>
            ) : filteredMovies.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="manage.movies.empty_state"
              >
                <p className="text-lg" style={{ color: "#7F8CA3" }}>
                  No movies found
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table data-ocid="manage.movies.table">
                  <TableHeader>
                    <TableRow style={{ borderColor: "#22324A" }}>
                      <TableHead style={{ color: "#7F8CA3" }}>Poster</TableHead>
                      <TableHead style={{ color: "#7F8CA3" }}>Title</TableHead>
                      <TableHead style={{ color: "#7F8CA3" }}>
                        Category
                      </TableHead>
                      <TableHead style={{ color: "#7F8CA3" }}>Genre</TableHead>
                      <TableHead style={{ color: "#7F8CA3" }}>Year</TableHead>
                      <TableHead style={{ color: "#7F8CA3" }}>
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovies.map((movie, i) => (
                      <TableRow
                        key={movie.id.toString()}
                        style={{ borderColor: "#22324A" }}
                        data-ocid={`manage.movies.row.${i + 1}`}
                      >
                        <TableCell>
                          <div
                            className="w-10 h-14 rounded overflow-hidden"
                            style={{ background: "#162742" }}
                          >
                            {movie.posterUrl ? (
                              <img
                                src={movie.posterUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="flex items-center justify-center h-full text-lg">
                                🎬
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          className="font-semibold"
                          style={{ color: "#E8EEF7" }}
                        >
                          {movie.title}
                        </TableCell>
                        <TableCell>
                          <span
                            className="px-2 py-0.5 rounded text-xs font-bold"
                            style={{
                              background: `${CATEGORY_COLORS[movie.category]}33`,
                              color: CATEGORY_COLORS[movie.category],
                            }}
                          >
                            {movie.category}
                          </span>
                        </TableCell>
                        <TableCell style={{ color: "#AAB6C6" }}>
                          {movie.genre || "—"}
                        </TableCell>
                        <TableCell style={{ color: "#AAB6C6" }}>
                          {Number(movie.year)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onEditMovie(movie)}
                              className="p-1.5 rounded transition-colors hover:bg-[#D2B04C]/20"
                              style={{ color: "#D2B04C" }}
                              data-ocid={`manage.movies.edit_button.${i + 1}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMovie(movie)}
                              className="p-1.5 rounded transition-colors hover:bg-[#B53A3A]/20"
                              style={{ color: "#B53A3A" }}
                              data-ocid={`manage.movies.delete_button.${i + 1}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Settings tab */}
        <TabsContent value="settings" className="mt-4">
          <div className="rounded-xl p-6 space-y-6" style={surfaceStyle}>
            <div>
              <h2
                className="text-lg font-bold mb-1"
                style={{ color: "#E8EEF7" }}
              >
                Public Access Permissions
              </h2>
              <p className="text-sm" style={{ color: "#7F8CA3" }}>
                Control what actions non-admin visitors can perform on movies.
              </p>
            </div>

            <div className="space-y-4">
              {/* Allow View */}
              <div
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "#0A1424", border: "1px solid #22324A" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(210,176,76,0.12)" }}
                  >
                    <Eye className="w-4 h-4" style={{ color: "#D2B04C" }} />
                  </div>
                  <div>
                    <Label
                      htmlFor="allow-view-switch"
                      className="font-semibold cursor-pointer"
                      style={{ color: "#E8EEF7" }}
                    >
                      Allow View
                    </Label>
                    <p className="text-xs mt-0.5" style={{ color: "#7F8CA3" }}>
                      Public users can open/watch movie links
                    </p>
                  </div>
                </div>
                <Switch
                  id="allow-view-switch"
                  checked={permissions.allowView}
                  onCheckedChange={(val) => onSetPermission("allowView", val)}
                  data-ocid="settings.allow_view.switch"
                  style={{
                    background: permissions.allowView ? "#D2B04C" : undefined,
                  }}
                />
              </div>

              {/* Allow Download */}
              <div
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "#0A1424", border: "1px solid #22324A" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(34,197,94,0.1)" }}
                  >
                    <Download
                      className="w-4 h-4"
                      style={{ color: "#22c55e" }}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="allow-download-switch"
                      className="font-semibold cursor-pointer"
                      style={{ color: "#E8EEF7" }}
                    >
                      Allow Download
                    </Label>
                    <p className="text-xs mt-0.5" style={{ color: "#7F8CA3" }}>
                      Public users can download movie files
                    </p>
                  </div>
                </div>
                <Switch
                  id="allow-download-switch"
                  checked={permissions.allowDownload}
                  onCheckedChange={(val) =>
                    onSetPermission("allowDownload", val)
                  }
                  data-ocid="settings.allow_download.switch"
                  style={{
                    background: permissions.allowDownload
                      ? "#D2B04C"
                      : undefined,
                  }}
                />
              </div>
            </div>

            <div
              className="p-3 rounded-lg text-xs"
              style={{
                background: "rgba(210,176,76,0.07)",
                border: "1px solid rgba(210,176,76,0.2)",
                color: "#AAB6C6",
              }}
            >
              💡 These permissions apply to visitors who are not logged in as
              admin. Admins always have full access.
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
