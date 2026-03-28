import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type BackendActor,
  type CandidCategory,
  type Movie,
  fromCandidMovie,
} from "../types";
import { useActor } from "./useActor";

export function useAllMovies() {
  const { actor, isFetching } = useActor();
  return useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: async () => {
      if (!actor) return [];
      const backend = actor as unknown as BackendActor;
      const result = await backend.getAllMovies();
      return result.map(fromCandidMovie);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchMovies(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Movie[]>({
    queryKey: ["movies", "search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      const backend = actor as unknown as BackendActor;
      const result = await backend.searchMovies(query);
      return result.map(fromCandidMovie);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useAddMovie() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      posterUrl: string;
      videoLink: string;
      genre: string;
      year: number;
      category: CandidCategory;
      folderId: [] | [bigint];
    }) => {
      const backend = actor as unknown as BackendActor;
      const movie = await backend.addMovie(
        params.title,
        params.description,
        params.posterUrl,
        params.videoLink,
        params.genre,
        BigInt(params.year),
        params.category,
        params.folderId,
      );
      return fromCandidMovie(movie);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}

export function useUpdateMovie() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      title: string;
      description: string;
      posterUrl: string;
      videoLink: string;
      genre: string;
      year: number;
      category: CandidCategory;
      folderId: [] | [bigint];
    }) => {
      const backend = actor as unknown as BackendActor;
      const result = await backend.updateMovie(
        params.id,
        params.title,
        params.description,
        params.posterUrl,
        params.videoLink,
        params.genre,
        BigInt(params.year),
        params.category,
        params.folderId,
      );
      return result.length > 0 ? fromCandidMovie(result[0]!) : null;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}

export function useDeleteMovie() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const backend = actor as unknown as BackendActor;
      return backend.deleteMovie(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}

export function useSeedMovies() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const backend = actor as unknown as BackendActor;
      const seed = [
        {
          title: "Dilwale Dulhania Le Jayenge",
          description:
            "A young man falls in love on a Europe trip and follows his beloved home to win her family's approval.",
          posterUrl: "https://picsum.photos/300/450?random=1",
          videoLink: "",
          genre: "Romance",
          year: 1995,
          category: { Bollywood: null } as CandidCategory,
        },
        {
          title: "3 Idiots",
          description:
            "Two friends search for their lost companion while reminiscing about their college days.",
          posterUrl: "https://picsum.photos/300/450?random=2",
          videoLink: "",
          genre: "Comedy Drama",
          year: 2009,
          category: { Bollywood: null } as CandidCategory,
        },
        {
          title: "The Dark Knight",
          description:
            "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy.",
          posterUrl: "https://picsum.photos/300/450?random=3",
          videoLink: "",
          genre: "Action",
          year: 2008,
          category: { Hollywood: null } as CandidCategory,
        },
        {
          title: "Inception",
          description:
            "A thief who enters the dreams of others to steal secrets from their subconscious.",
          posterUrl: "https://picsum.photos/300/450?random=4",
          videoLink: "",
          genre: "Sci-Fi Thriller",
          year: 2010,
          category: { Hollywood: null } as CandidCategory,
        },
        {
          title: "Chhello Divas",
          description:
            "A group of friends navigate the final days of their college life in Gujarat.",
          posterUrl: "https://picsum.photos/300/450?random=5",
          videoLink: "",
          genre: "Comedy",
          year: 2015,
          category: { Gujarati: null } as CandidCategory,
        },
        {
          title: "Baahubali: The Beginning",
          description:
            "An epic tale of a young man who discovers his royal heritage and fights for justice.",
          posterUrl: "https://picsum.photos/300/450?random=6",
          videoLink: "",
          genre: "Action Epic",
          year: 2015,
          category: { Tollywood: null } as CandidCategory,
        },
      ];
      await Promise.all(
        seed.map((m) =>
          backend.addMovie(
            m.title,
            m.description,
            m.posterUrl,
            m.videoLink,
            m.genre,
            BigInt(m.year),
            m.category,
            [],
          ),
        ),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}
