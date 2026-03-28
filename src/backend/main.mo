import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";

persistent actor {

  // ─── Types ───────────────────────────────────────────────────────────────

  public type Category = { #Bollywood; #Hollywood; #Gujarati; #Tollywood };

  public type Folder = {
    id : Nat;
    name : Text;
    category : Category;
    createdAt : Int;
  };

  public type Movie = {
    id : Nat;
    title : Text;
    description : Text;
    posterUrl : Text;
    videoLink : Text;
    genre : Text;
    year : Nat;
    category : Category;
    folderId : ?Nat;
    createdAt : Int;
  };

  // ─── Stable State ────────────────────────────────────────────────────────

  var nextFolderId : Nat = 1;
  var nextMovieId : Nat = 1;
  var folders : [Folder] = [];
  var movies : [Movie] = [];

  // ─── Folder CRUD ─────────────────────────────────────────────────────────

  public func addFolder(name : Text, category : Category) : async Folder {
    let folder : Folder = {
      id = nextFolderId;
      name = name;
      category = category;
      createdAt = Time.now();
    };
    folders := Array.append(folders, [folder]);
    nextFolderId += 1;
    folder
  };

  public func updateFolder(id : Nat, name : Text) : async ?Folder {
    var result : ?Folder = null;
    folders := Array.map<Folder, Folder>(folders, func(f) {
      if (f.id == id) {
        let updated = { id = f.id; name = name; category = f.category; createdAt = f.createdAt };
        result := ?updated;
        updated
      } else { f }
    });
    result
  };

  public func deleteFolder(id : Nat) : async Bool {
    let before = folders.size();
    folders := Array.filter<Folder>(folders, func(f) { f.id != id });
    movies := Array.map<Movie, Movie>(movies, func(m) {
      switch (m.folderId) {
        case (?fid) {
          if (fid == id) {
            { id = m.id; title = m.title; description = m.description;
              posterUrl = m.posterUrl; videoLink = m.videoLink; genre = m.genre;
              year = m.year; category = m.category; folderId = null;
              createdAt = m.createdAt }
          } else { m }
        };
        case null { m };
      }
    });
    folders.size() < before
  };

  public query func getFolder(id : Nat) : async ?Folder {
    Array.find<Folder>(folders, func(f) { f.id == id })
  };

  public query func getAllFolders() : async [Folder] { folders };

  public query func getFoldersByCategory(category : Category) : async [Folder] {
    Array.filter<Folder>(folders, func(f) { f.category == category })
  };

  // ─── Movie CRUD ──────────────────────────────────────────────────────────

  public func addMovie(
    title : Text,
    description : Text,
    posterUrl : Text,
    videoLink : Text,
    genre : Text,
    year : Nat,
    category : Category,
    folderId : ?Nat
  ) : async Movie {
    let movie : Movie = {
      id = nextMovieId;
      title = title;
      description = description;
      posterUrl = posterUrl;
      videoLink = videoLink;
      genre = genre;
      year = year;
      category = category;
      folderId = folderId;
      createdAt = Time.now();
    };
    movies := Array.append(movies, [movie]);
    nextMovieId += 1;
    movie
  };

  public func updateMovie(
    id : Nat,
    title : Text,
    description : Text,
    posterUrl : Text,
    videoLink : Text,
    genre : Text,
    year : Nat,
    category : Category,
    folderId : ?Nat
  ) : async ?Movie {
    var result : ?Movie = null;
    movies := Array.map<Movie, Movie>(movies, func(m) {
      if (m.id == id) {
        let updated : Movie = {
          id = m.id;
          title = title;
          description = description;
          posterUrl = posterUrl;
          videoLink = videoLink;
          genre = genre;
          year = year;
          category = category;
          folderId = folderId;
          createdAt = m.createdAt;
        };
        result := ?updated;
        updated
      } else { m }
    });
    result
  };

  public func deleteMovie(id : Nat) : async Bool {
    let before = movies.size();
    movies := Array.filter<Movie>(movies, func(m) { m.id != id });
    movies.size() < before
  };

  public query func getMovie(id : Nat) : async ?Movie {
    Array.find<Movie>(movies, func(m) { m.id == id })
  };

  public query func getAllMovies() : async [Movie] { movies };

  public query func getMoviesByCategory(category : Category) : async [Movie] {
    Array.filter<Movie>(movies, func(m) { m.category == category })
  };

  public query func getMoviesByFolder(folderId : Nat) : async [Movie] {
    Array.filter<Movie>(movies, func(m) {
      switch (m.folderId) {
        case (?fid) { fid == folderId };
        case null { false };
      }
    })
  };

  public query func searchMovies(q : Text) : async [Movie] {
    let lower = Text.toLowercase(q);
    Array.filter<Movie>(movies, func(m) {
      Text.contains(Text.toLowercase(m.title), #text lower)
    })
  };

}
