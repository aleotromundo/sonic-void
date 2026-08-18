export type LocalQueueItem = {
  id: string;
  source: "spotify" | "musicbrainz";
  kind: "track" | "album";
  name: string;
  artist: string;
  album: string;
  releaseYear: string;
  durationLabel: string;
  popularity: number;
  imageUrl: string | null;
  spotifyUrl: string;
  previewUrl: string | null;
  availableMarkets: string[];
};

export type LocalLibraryState = {
  favorites: string[];
  queue: LocalQueueItem[];
  preferences: { volume: number; compact: boolean };
};

const KEY = "sonic-void-library-v1";
const fallback: LocalLibraryState = { favorites: [], queue: [], preferences: { volume: 0.8, compact: false } };

export function loadLocalLibrary(): LocalLibraryState {
  if (typeof window === "undefined") return fallback;
  try { return { ...fallback, ...JSON.parse(window.localStorage.getItem(KEY) || "{}")} as LocalLibraryState; } catch { return fallback; }
}

export function saveLocalLibrary(state: LocalLibraryState) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(state));
}

// Supabase migration point: replace these two functions with async repository methods.
export const libraryRepository = { load: loadLocalLibrary, save: saveLocalLibrary };
