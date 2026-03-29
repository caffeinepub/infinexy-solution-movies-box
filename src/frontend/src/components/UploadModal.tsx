import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Image, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useBlobUpload } from "../hooks/useBlobUpload";
import { useAddMovie, useUpdateMovie } from "../hooks/useMovies";
import { CATEGORIES, type Movie, stringToCategory } from "../types";

const MAX_FILE_SIZE_BYTES = 40 * 1024 * 1024 * 1024; // 40 GB
const ACCEPTED_TYPES: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "video/x-matroska": "MKV",
  "video/mp4": "MP4",
  "video/x-msvideo": "AVI",
  "video/avi": "AVI",
};
const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.mkv,.mp4,.avi";

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  editMovie?: Movie | null;
  defaultCategory?: string;
}

export function UploadModal({
  open,
  onClose,
  editMovie,
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
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const deviceFileInputRef = useRef<HTMLInputElement>(null);

  const addMovie = useAddMovie();
  const updateMovie = useUpdateMovie();
  const posterUpload = useBlobUpload();
  const deviceUpload = useBlobUpload();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPosterUrl("");
    setVideoLink("");
    setGenre("");
    setYear(String(new Date().getFullYear()));
    setCategory(defaultCategory ?? "Bollywood");
    setUploadedFile(null);
  };

  const handlePosterFile = async (file: File) => {
    try {
      const url = await posterUpload.upload(file);
      setPosterUrl(url);
      toast.success("Poster uploaded");
    } catch {
      const objUrl = URL.createObjectURL(file);
      setPosterUrl(objUrl);
    }
  };

  const handleDeviceFile = async (file: File) => {
    const isAccepted =
      Object.keys(ACCEPTED_TYPES).includes(file.type) ||
      /\.(jpg|jpeg|png|mkv|mp4|avi)$/i.test(file.name);
    if (!isAccepted) {
      toast.error(
        "Unsupported file type. Please use JPEG, PNG, MKV, MP4, or AVI.",
      );
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File too large. Maximum allowed size is 40 GB.");
      return;
    }

    setUploadedFile({ name: file.name, size: file.size, type: file.type });

    try {
      const url = await deviceUpload.upload(file);
      const isImage =
        file.type.startsWith("image/") || /\.(jpg|jpeg|png)$/i.test(file.name);
      if (isImage) {
        setPosterUrl(url);
        toast.success("Image uploaded and set as poster.");
      } else {
        setVideoLink(url);
        toast.success("Video uploaded successfully.");
      }
    } catch (err) {
      toast.error(
        `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setUploadedFile(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleDeviceFile(file);
  };

  const openDeviceFilePicker = () => {
    if (!deviceUpload.isUploading) deviceFileInputRef.current?.click();
  };

  const isPending = addMovie.isPending || updateMovie.isPending;
  const isAnyUploading = posterUpload.isUploading || deviceUpload.isUploading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const candid = stringToCategory(category);
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
          folderId: [],
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
          folderId: [],
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
                  {posterUpload.isUploading
                    ? `Uploading ${posterUpload.uploadProgress}%…`
                    : "Upload poster image"}
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

          {/* Upload from Device */}
          <div>
            <Label style={labelStyle} className="flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              Upload from Device
              <span className="ml-1 text-xs" style={{ color: "#5A7298" }}>
                (JPEG · PNG · MKV · MP4 · AVI · up to 40 GB)
              </span>
            </Label>

            <button
              type="button"
              className="mt-1 w-full rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-colors"
              style={{
                background: isDragging ? "#162742" : "#0E1A2B",
                border: `2px dashed ${isDragging ? "#D2B04C" : "#263A55"}`,
                minHeight: "96px",
                cursor: deviceUpload.isUploading ? "not-allowed" : "pointer",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={openDeviceFilePicker}
              disabled={deviceUpload.isUploading}
            >
              {deviceUpload.isUploading ? (
                <div className="w-full space-y-2 px-2">
                  <div
                    className="flex items-center justify-between text-xs"
                    style={{ color: "#AAB6C6" }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Loader2
                        className="w-3.5 h-3.5 animate-spin"
                        style={{ color: "#D2B04C" }}
                      />
                      {uploadedFile?.name ?? "Uploading…"}
                    </span>
                    <span style={{ color: "#D2B04C" }}>
                      {deviceUpload.uploadProgress}%
                    </span>
                  </div>
                  <Progress
                    value={deviceUpload.uploadProgress}
                    className="h-1.5"
                    style={{ background: "#1A2E47" }}
                  />
                  {uploadedFile && (
                    <p
                      className="text-xs text-center"
                      style={{ color: "#5A7298" }}
                    >
                      {formatBytes(uploadedFile.size)}
                    </p>
                  )}
                </div>
              ) : uploadedFile ? (
                <div className="flex flex-col items-center gap-1">
                  <CheckCircle2
                    className="w-6 h-6"
                    style={{ color: "#4CAF50" }}
                  />
                  <p
                    className="text-xs font-medium"
                    style={{ color: "#E8EEF7" }}
                  >
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs" style={{ color: "#5A7298" }}>
                    {formatBytes(uploadedFile.size)}
                  </p>
                  <button
                    type="button"
                    className="mt-1 flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                    style={{
                      color: "#AAB6C6",
                      background: "#162742",
                      border: "1px solid #263A55",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-7 h-7" style={{ color: "#D2B04C" }} />
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#AAB6C6" }}
                  >
                    {isDragging
                      ? "Drop file here"
                      : "Click or drag & drop to upload"}
                  </p>
                  <p className="text-xs" style={{ color: "#5A7298" }}>
                    Supports JPEG, PNG, MKV, MP4, AVI — max 40 GB
                  </p>
                </>
              )}
            </button>

            <input
              ref={deviceFileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleDeviceFile(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </div>

          <div>
            <Label style={labelStyle}>Category</Label>
            <Select value={category} onValueChange={setCategory}>
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
              disabled={isPending || isAnyUploading}
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
