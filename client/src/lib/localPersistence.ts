export type LocalQueueItem = {
  id: string;
  source: "spotify" | "musicbrainz" | "audius" | "jamendo" | "ccmixter" | "openverse";
  kind: "track" | "album";
  name: string;
  artist: string;
  album: string;
  releaseYear: string;
  durationMs: number;
  durationLabel: string;
  popularity: number;
  imageUrl: string | null;
  spotifyUrl: string;
  previewUrl: string | null;
  availableMarkets: string[];
  licenseLabel: string;
  attribution: string;
  licenseUrl: string | null;
  matchMode?: "strict" | "discovery";
};

export type LocalPlaylist = {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
};

export type LocalHistoryItem = {
  track: LocalQueueItem;
  playedAt: number;
  plays: number;
};

export type LocalLibraryState = {
  favorites: string[];
  queue: LocalQueueItem[];
  playlists: LocalPlaylist[];
  history: LocalHistoryItem[];
  preferences: { volume: number; compact: boolean; muted: boolean };
};

export type LocalStationCatalog = Record<string, { updatedAt: number; tracks: LocalQueueItem[] }>;

const KEY = "sonic-void-library-v1";
const CATALOG_KEY = "sonic-void-station-catalog-v1";
const fallback: LocalLibraryState = { favorites: [], queue: [], playlists: [], history: [], preferences: { volume: 0.8, compact: false, muted: false } };

export function loadLocalLibrary(): LocalLibraryState {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = JSON.parse(window.localStorage.getItem(KEY) || "{}");
    return {
      ...fallback,
      ...stored,
      favorites: Array.isArray(stored.favorites) ? stored.favorites : [],
      queue: Array.isArray(stored.queue) ? stored.queue : [],
      playlists: Array.isArray(stored.playlists) ? stored.playlists : [],
      history: Array.isArray(stored.history) ? stored.history.filter((item: any) => item?.track?.previewUrl) : [],
      preferences: { ...fallback.preferences, ...(stored.preferences || {}) },
    } as LocalLibraryState;
  } catch {
    return fallback;
  }
}

export function saveLocalLibrary(state: LocalLibraryState) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadStationCatalog(): LocalStationCatalog {
  if (typeof window === "undefined") return {};
  try {
    const stored = JSON.parse(window.localStorage.getItem(CATALOG_KEY) || "{}");
    return stored && typeof stored === "object" ? stored as LocalStationCatalog : {};
  } catch {
    return {};
  }
}

export function saveStationCatalog(catalog: LocalStationCatalog) {
  if (typeof window !== "undefined") window.localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
}

// Supabase migration point: replace these functions with async repository methods.
export const libraryRepository = { load: loadLocalLibrary, save: saveLocalLibrary };
export const catalogRepository = { load: loadStationCatalog, save: saveStationCatalog };
