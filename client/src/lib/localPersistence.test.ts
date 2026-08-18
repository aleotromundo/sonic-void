import { afterEach, describe, expect, it } from "vitest";
import { loadLocalLibrary, localTrackKey, saveLocalLibrary } from "./localPersistence";

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

  it("namespaces track identity by source", () => {
    expect(localTrackKey({ source: "jamendo", id: "same-id" })).toBe("jamendo:same-id");
    expect(localTrackKey({ source: "audius", id: "same-id" })).not.toBe("jamendo:same-id");
  });

  it("round-trips a local playlist and queue", () => {
    (globalThis as { window?: unknown }).window = { localStorage: localStorageMock };
    const state = loadLocalLibrary();
    const track = { id: "track-1", source: "jamendo" as const, kind: "track" as const, name: "Signal", artist: "Artist", album: "Album", releaseYear: "2026", durationMs: 180000, durationLabel: "3:00", popularity: 0, imageUrl: null, spotifyUrl: "https://www.jamendo.com/track/track-1", previewUrl: "https://cdn.jamendo.com/track-1.mp3", availableMarkets: [], licenseLabel: "Creative Commons / Jamendo", attribution: "Artist · Jamendo", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" };
    saveLocalLibrary({ ...state, queue: [track], history: [{ track, playedAt: 123, plays: 2 }], playlists: [{ id: "playlist-1", name: "Night drive", trackIds: [track.id], createdAt: 1 }] });
    const restored = loadLocalLibrary();
    expect(restored.queue[0]).toMatchObject({ id: "track-1", previewUrl: "https://cdn.jamendo.com/track-1.mp3", licenseLabel: "Creative Commons / Jamendo", attribution: "Artist · Jamendo", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" });
    expect(restored.playlists[0]).toMatchObject({ name: "Night drive", trackIds: ["track-1"] });
    expect(restored.history[0]).toMatchObject({ playedAt: 123, plays: 2, track: { id: "track-1", licenseLabel: "Creative Commons / Jamendo", attribution: "Artist · Jamendo" } });
  });
});
