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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddFolder, useUpdateFolder } from "../hooks/useFolders";
import { CATEGORIES, type Folder, stringToCategory } from "../types";

interface FolderModalProps {
  open: boolean;
  onClose: () => void;
  editFolder?: Folder | null;
  defaultCategory?: string;
}

export function FolderModal({
  open,
  onClose,
  editFolder,
  defaultCategory,
}: FolderModalProps) {
  const isEdit = !!editFolder;
  const [name, setName] = useState(editFolder?.name ?? "");
  const [category, setCategory] = useState(
    editFolder?.category ?? defaultCategory ?? "Bollywood",
  );

  const addFolder = useAddFolder();
  const updateFolder = useUpdateFolder();
  const isPending = addFolder.isPending || updateFolder.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Folder name is required");
      return;
    }
    try {
      if (isEdit && editFolder) {
        await updateFolder.mutateAsync({
          id: editFolder.id,
          name: name.trim(),
        });
        toast.success("Folder renamed");
      } else {
        await addFolder.mutateAsync({
          name: name.trim(),
          category: stringToCategory(category),
        });
        toast.success("Folder created");
        setName("");
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
        className="max-w-sm"
        style={{ background: "#121F33", borderColor: "#22324A" }}
        data-ocid="folder.modal"
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#E8EEF7" }}>
            {isEdit ? "Rename Folder" : "New Folder"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label style={labelStyle}>Folder Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Action, 2024 Releases…"
              style={inputStyle}
              className="mt-1"
              autoFocus
              data-ocid="folder.input"
            />
          </div>
          {!isEdit && (
            <div>
              <Label style={labelStyle}>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className="mt-1"
                  style={inputStyle}
                  data-ocid="folder.select"
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
          )}
          <div className="flex gap-3 pt-1">
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
              data-ocid="folder.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 font-bold"
              style={{ background: "#D2B04C", color: "#0B1220" }}
              data-ocid="folder.submit_button"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isEdit ? "Rename" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
