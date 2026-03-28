export type Category = "Bollywood" | "Hollywood" | "Gujarati" | "Tollywood";

export interface Folder {
  id: bigint;
  name: string;
  category: Category;
  createdAt: bigint;
}

export interface Movie {
  id: bigint;
  title: string;
  description: string;
  posterUrl: string;
  videoLink: string;
  genre: string;
  year: bigint;
  category: Category;
  folderId: [] | [bigint];
  createdAt: bigint;
}

export type NavView = "all" | Category | "manage";

export interface BackendActor {
  addFolder(name: string, category: CandidCategory): Promise<CandidFolder>;
  updateFolder(id: bigint, name: string): Promise<[] | [CandidFolder]>;
  deleteFolder(id: bigint): Promise<boolean>;
  getFolder(id: bigint): Promise<[] | [CandidFolder]>;
  getAllFolders(): Promise<CandidFolder[]>;
  getFoldersByCategory(category: CandidCategory): Promise<CandidFolder[]>;
  addMovie(
    title: string,
    description: string,
    posterUrl: string,
    videoLink: string,
    genre: string,
    year: bigint,
    category: CandidCategory,
    folderId: [] | [bigint],
  ): Promise<CandidMovie>;
  updateMovie(
    id: bigint,
    title: string,
    description: string,
    posterUrl: string,
    videoLink: string,
    genre: string,
    year: bigint,
    category: CandidCategory,
    folderId: [] | [bigint],
  ): Promise<[] | [CandidMovie]>;
  deleteMovie(id: bigint): Promise<boolean>;
  getMovie(id: bigint): Promise<[] | [CandidMovie]>;
  getAllMovies(): Promise<CandidMovie[]>;
  getMoviesByCategory(category: CandidCategory): Promise<CandidMovie[]>;
  getMoviesByFolder(folderId: bigint): Promise<CandidMovie[]>;
  searchMovies(query: string): Promise<CandidMovie[]>;
}

export type CandidCategory =
  | { Bollywood: null }
  | { Hollywood: null }
  | { Gujarati: null }
  | { Tollywood: null };

export interface CandidFolder {
  id: bigint;
  name: string;
  category: CandidCategory;
  createdAt: bigint;
}

export interface CandidMovie {
  id: bigint;
  title: string;
  description: string;
  posterUrl: string;
  videoLink: string;
  genre: string;
  year: bigint;
  category: CandidCategory;
  folderId: [] | [bigint];
  createdAt: bigint;
}

export function categoryToString(cat: CandidCategory): Category {
  if ("Bollywood" in cat) return "Bollywood";
  if ("Hollywood" in cat) return "Hollywood";
  if ("Gujarati" in cat) return "Gujarati";
  return "Tollywood";
}

export function stringToCategory(s: string): CandidCategory {
  if (s === "Bollywood") return { Bollywood: null };
  if (s === "Hollywood") return { Hollywood: null };
  if (s === "Gujarati") return { Gujarati: null };
  return { Tollywood: null };
}

export function fromCandidFolder(f: CandidFolder): Folder {
  return { ...f, category: categoryToString(f.category) };
}

export function fromCandidMovie(m: CandidMovie): Movie {
  return { ...m, category: categoryToString(m.category) };
}

export const CATEGORIES: Category[] = [
  "Bollywood",
  "Hollywood",
  "Gujarati",
  "Tollywood",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Bollywood: "#E05A00",
  Hollywood: "#1A6BBD",
  Gujarati: "#2A9D4B",
  Tollywood: "#8B2BBD",
};
