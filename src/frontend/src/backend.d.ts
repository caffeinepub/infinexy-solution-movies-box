import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export type Category = { Bollywood: null } | { Hollywood: null } | { Gujarati: null } | { Tollywood: null };

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
    folderId: Option<bigint>;
    createdAt: bigint;
}

export interface backendInterface {
    addFolder(name: string, category: Category): Promise<Folder>;
    updateFolder(id: bigint, name: string): Promise<Option<Folder>>;
    deleteFolder(id: bigint): Promise<boolean>;
    getFolder(id: bigint): Promise<Option<Folder>>;
    getAllFolders(): Promise<Folder[]>;
    getFoldersByCategory(category: Category): Promise<Folder[]>;
    addMovie(
        title: string,
        description: string,
        posterUrl: string,
        videoLink: string,
        genre: string,
        year: bigint,
        category: Category,
        folderId: Option<bigint>
    ): Promise<Movie>;
    updateMovie(
        id: bigint,
        title: string,
        description: string,
        posterUrl: string,
        videoLink: string,
        genre: string,
        year: bigint,
        category: Category,
        folderId: Option<bigint>
    ): Promise<Option<Movie>>;
    deleteMovie(id: bigint): Promise<boolean>;
    getMovie(id: bigint): Promise<Option<Movie>>;
    getAllMovies(): Promise<Movie[]>;
    getMoviesByCategory(category: Category): Promise<Movie[]>;
    getMoviesByFolder(folderId: bigint): Promise<Movie[]>;
    searchMovies(q: string): Promise<Movie[]>;
}
