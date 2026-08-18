import { afterEach, describe, expect, it } from "vitest";
import { loadLocalLibrary, saveLocalLibrary } from "./localPersistence";

const storage = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

describe("local library persistence", () => {
  afterEach(() => {
    storage.clear();
    delete (globalThis as { window?: unknown }).window;
  });

  it("initializes playlists and queue without inventing user content", () => {
    (globalThis as { window?: unknown }).window = { localStorage: localStorageMock };
    expect(loadLocalLibrary()).toMatchObject({ favorites: [], queue: [], playlists: [] });
  });

  it("round-trips a local playlist and queue", () => {
    (globalThis as { window?: unknown }).window = { localStorage: localStorageMock };
    const state = loadLocalLibrary();
    const track = { id: "track-1", source: "musicbrainz" as const, kind: "track" as const, name: "Signal", artist: "Artist", album: "Album", releaseYear: "2026", durationLabel: "3:00", popularity: 0, imageUrl: null, spotifyUrl: "https://musicbrainz.org", previewUrl: null, availableMarkets: [] };
    saveLocalLibrary({ ...state, queue: [track], playlists: [{ id: "playlist-1", name: "Night drive", trackIds: [track.id], createdAt: 1 }] });
    const restored = loadLocalLibrary();
    expect(restored.queue[0]?.id).toBe("track-1");
    expect(restored.playlists[0]).toMatchObject({ name: "Night drive", trackIds: ["track-1"] });
  });
});
