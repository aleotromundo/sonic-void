import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("axios", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

import axios from "axios";
import { appRouter } from "./routers";
import { isLrclibMatch, parseLrcLyrics } from "./music";
import type { TrpcContext } from "./_core/context";

function context(): TrpcContext { return { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] }; }
const mockedGet = vi.mocked(axios.get);

beforeEach(() => {
  delete process.env.SPOTIFY_CLIENT_ID;
  delete process.env.SPOTIFY_CLIENT_SECRET;
  delete process.env.GENIUS_ACCESS_TOKEN;
  mockedGet.mockReset();
  mockedGet.mockImplementation(async (url: string) => {
    if (url.includes("/artist")) return { data: { artists: [{ id: "artist-1", name: "Test" }] } } as any;
    if (url.includes("/recording")) return { data: { count: 1, recordings: [{ id: "recording-1", title: "Unknown", length: 180000, "artist-credit": [{ name: "Other Artist" }], releases: [{ title: "Other Album", date: "2020-01-01", "release-group": { id: "group-2" } }] }] } } as any;
    return { data: { "release-groups": [{ id: "group-1", title: "Test Album", "first-release-date": "2020-01-01" }], "release-group-count": 1 } } as any;
  });
});

describe("music tRPC procedures", () => {
  it("resolves an artist query to the artist's albums", async () => {
    const result = await appRouter.createCaller(context()).music.search({ query: "Test", offset: 0 });
    expect(result).toMatchObject({ configured: true, source: "musicbrainz", total: 1 });
    expect(result.items[0]).toMatchObject({ name: "Test Album", kind: "album", artist: "Test", imageUrl: "https://coverartarchive.org/release-group/group-1/front-500" });
  });

  it("falls back to free recording search when no exact artist exists", async () => {
    const result = await appRouter.createCaller(context()).music.search({ query: "Unknown", offset: 0 });
    expect(result.items[0]).toMatchObject({ kind: "track", name: "Unknown", artist: "Other Artist" });
  });

  it("parses synchronized LRC timestamps deterministically", () => {
    expect(parseLrcLyrics("[00:02.50]Second line\n[00:01.00]First line\n[00:03.000]Third line")).toEqual([
      { timeMs: 1000, text: "First line" },
      { timeMs: 2500, text: "Second line" },
      { timeMs: 3000, text: "Third line" },
    ]);
  });

  it("accepts matching LRCLIB metadata within duration tolerance", () => {
    expect(isLrclibMatch({ trackName: "Canción", artistName: "Artista", albumName: "Álbum", duration: 180 }, "Cancion", "Artista", "Album", 182)).toBe(true);
    expect(isLrclibMatch({ trackName: "Canción", artistName: "Otra artista", albumName: "Álbum", duration: 180 }, "Cancion", "Artista", "Album", 180)).toBe(false);
    expect(isLrclibMatch({ trackName: "Canción", artistName: "Artista", albumName: "Álbum", duration: 240 }, "Cancion", "Artista", "Album", 180)).toBe(false);
  });

  it("returns a safe not-found result when LRCLIB has no matching lyrics", async () => {
    mockedGet.mockResolvedValueOnce({ data: {} } as any);
    const result = await appRouter.createCaller(context()).music.lyrics({ name: "Song", artist: "Artist", album: "Album", duration: 180000 });
    expect(result).toMatchObject({ status: "not_found", text: null, syncedLyrics: [], sourceName: "LRCLIB" });
  });
});
