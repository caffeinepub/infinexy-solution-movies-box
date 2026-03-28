import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Image, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useBlobUpload } from "../hooks/useBlobUpload";
import { useAddMovie, useUpdateMovie } from "../hooks/useMovies";
import {
  CATEGORIES,
  type Folder,
  type Movie,
  stringToCategory,
} from "../types";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  editMovie?: Movie | null;
  folders: Folder[];
  defaultCategory?: string;
}

export function UploadModal({
  open,
  onClose,
  editMovie,
  folders,
  defaultCategory,
}: UploadModalProps) {
  const isEdit = !!editMovie;
  const [title, setTitle] = useState(editMovie?.title ?? "");
  const [description, setDescription] = useState(editMovie?.description ?? "");
  const [posterUrl, setPosterUrl] = useState(editMovie?.posterUrl ?? "");
  const [videoLink, setVideoLink] = useState(editMovie?.videoLink ?? "");
  const [genre, setGenre] = useState(editMovie?.genre ?? "");
  const [year, setYear] = useState(
    editMovie
      ? String(Number(editMovie.year))
      : String(new Date().getFullYear()),
  );
  const [category, setCategory] = useState(
    editMovie?.category ?? defaultCategory ?? "Bollywood",
  );
  const [folderId, setFolderId] = useState(
    editMovie?.folderId && editMovie.folderId.length > 0
      ? editMovie.folderId[0]!.toString()
      : "none",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMovie = useAddMovie();
  const updateMovie = useUpdateMovie();
  const { upload, isUploading, uploadProgress } = useBlobUpload();

  // Reset form when movie changes
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPosterUrl("");
    setVideoLink("");
    setGenre("");
    setYear(String(new Date().getFullYear()));
    setCategory(defaultCategory ?? "Bollywood");
    setFolderId("none");
  };

  const handlePosterFile = async (file: File) => {
    try {
      const url = await upload(file);
      setPosterUrl(url);
      toast.success("Poster uploaded");
    } catch {
      // Fallback to object URL
      const objUrl = URL.createObjectURL(file);
      setPosterUrl(objUrl);
    }
  };

  const categoryFolders = folders.filter((f) => f.category === category);
  const isPending = addMovie.isPending || updateMovie.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const candid = stringToCategory(category);
    const folderIdParam: [] | [bigint] =
      folderId !== "none" ? [BigInt(folderId)] : [];
    try {
      if (isEdit && editMovie) {
        await updateMovie.mutateAsync({
          id: editMovie.id,
          title: title.trim(),
          description: description.trim(),
          posterUrl: posterUrl.trim(),
          videoLink: videoLink.trim(),
          genre: genre.trim(),
          year: Number.parseInt(year) || new Date().getFullYear(),
          category: candid,
          folderId: folderIdParam,
        });
        toast.success("Movie updated!");
      } else {
        await addMovie.mutateAsync({
          title: title.trim(),
          description: description.trim(),
          posterUrl: posterUrl.trim(),
          videoLink: videoLink.trim(),
          genre: genre.trim(),
          year: Number.parseInt(year) || new Date().getFullYear(),
          category: candid,
          folderId: folderIdParam,
        });
        toast.success("Movie added!");
        resetForm();
      }
      onClose();
    } catch (err) {
      toast.error(
        `Failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  const inputStyle = {
    background: "#111E31",
    borderColor: "#263A55",
    color: "#E8EEF7",
  };
  const labelStyle = { color: "#AAB6C6" };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ background: "#121F33", borderColor: "#22324A" }}
        data-ocid="upload.modal"
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#E8EEF7" }}>
            {isEdit ? "Edit Movie" : "Upload New Movie"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label style={labelStyle}>Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Movie title"
              style={inputStyle}
              className="mt-1"
              data-ocid="upload.input"
            />
          </div>

          <div>
            <Label style={labelStyle}>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description…"
              style={{ ...inputStyle, resize: "vertical" }}
              className="mt-1"
              rows={3}
              data-ocid="upload.textarea"
            />
          </div>

          <div>
            <Label style={labelStyle}>Poster Image</Label>
            <div className="mt-1 space-y-2">
              <Input
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="Paste image URL or upload below…"
                style={inputStyle}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    background: "#162742",
                    color: "#AAB6C6",
                    border: "1px dashed #263A55",
                  }}
                  data-ocid="upload.upload_button"
                >
                  <Image className="w-4 h-4" />
                  {isUploading
                    ? `Uploading ${uploadProgress}%…`
                    : "Upload from device"}
                </button>
                {posterUrl && (
                  <img
                    src={posterUrl}
                    alt=""
                    className="w-12 h-16 object-cover rounded"
                    style={{ border: "1px solid #263A55" }}
                  />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handlePosterFile(e.target.files[0]);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label style={labelStyle}>Genre</Label>
              <Input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Action, Drama…"
                style={inputStyle}
                className="mt-1"
              />
            </div>
            <div>
              <Label style={labelStyle}>Year</Label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min={1900}
                max={2099}
                style={inputStyle}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label style={labelStyle}>Video Link</Label>
            <Input
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="YouTube, Drive link…"
              style={inputStyle}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label style={labelStyle}>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v);
                  setFolderId("none");
                }}
              >
                <SelectTrigger
                  className="mt-1"
                  style={inputStyle}
                  data-ocid="upload.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{ background: "#162742", borderColor: "#263A55" }}
                >
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} style={{ color: "#E8EEF7" }}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={labelStyle}>Folder (optional)</Label>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger className="mt-1" style={inputStyle}>
                  <SelectValue placeholder="No folder" />
                </SelectTrigger>
                <SelectContent
                  style={{ background: "#162742", borderColor: "#263A55" }}
                >
                  <SelectItem value="none" style={{ color: "#AAB6C6" }}>
                    No folder
                  </SelectItem>
                  {categoryFolders.map((f) => (
                    <SelectItem
                      key={f.id.toString()}
                      value={f.id.toString()}
                      style={{ color: "#E8EEF7" }}
                    >
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              style={{
                borderColor: "#263A55",
                color: "#AAB6C6",
                background: "transparent",
              }}
              data-ocid="upload.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isUploading}
              className="flex-1 font-bold uppercase text-xs tracking-wider"
              style={{ background: "#D2B04C", color: "#0B1220" }}
              data-ocid="upload.submit_button"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isEdit ? "Save Changes" : "Add Movie"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
