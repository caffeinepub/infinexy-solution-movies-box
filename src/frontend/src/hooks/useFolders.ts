import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { withRetry } from "../lib/retryBackend";
import {
  type BackendActor,
  type CandidCategory,
  type Folder,
  fromCandidFolder,
} from "../types";
import { useActor } from "./useActor";

export function useAllFolders() {
  const { actor, isFetching } = useActor();
  return useQuery<Folder[]>({
    queryKey: ["folders"],
    queryFn: async () => {
      if (!actor) return [];
      const backend = actor as unknown as BackendActor;
      const result = await withRetry(() => backend.getAllFolders());
      return result.map(fromCandidFolder);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFolder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { name: string; category: CandidCategory }) => {
      const backend = actor as unknown as BackendActor;
      const result = await withRetry(() =>
        backend.addFolder(params.name, params.category),
      );
      return fromCandidFolder(result);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useUpdateFolder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: bigint; name: string }) => {
      const backend = actor as unknown as BackendActor;
      const result = await withRetry(() =>
        backend.updateFolder(params.id, params.name),
      );
      return result.length > 0 ? fromCandidFolder(result[0]!) : null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useDeleteFolder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const backend = actor as unknown as BackendActor;
      return withRetry(() => backend.deleteFolder(id));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["folders"] });
      qc.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}
