import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import { emptySearchResult, getGeniusLyrics, interpretQuery, isSpotifyConfigured, rankMusicTracks, searchMusic, searchSpotify } from "./music";

describe("music integrations", () => {
  it("interprets natural artist and album queries", () => {
    expect(interpretQuery("Shakira")).toMatchObject({ type: "artist", artist: "shakira" });
    expect(interpretQuery("álbumes de Shakira")).toMatchObject({ type: "album", artist: "shakira" });
    expect(interpretQuery("canciones de Shakira")).toMatchObject({ type: "track", artist: "shakira" });
  });
  it("ranks exact track, album and artist matches before broad matches", () => {
    const base = (id: string, name: string, artist: string, album: string) => ({ id, source: "musicbrainz" as const, kind: "track" as const, name, artist, album, releaseDate: "2020", releaseYear: "2020", durationMs: 1, durationLabel: "0:01", popularity: 0, imageUrl: null, spotifyUrl: "https://musicbrainz.org", previewUrl: null, availableMarkets: [] });
    expect(rankMusicTracks([base("b", "Other", "Other Artist", "Album"), base("a", "Shakira", "Shakira", "Album")], "Shakira")[0]?.id).toBe("a");
    expect(rankMusicTracks([base("b", "Track B", "Artist", "Other Album"), base("a", "Track A", "Artist", "Greatest Hits")], "Greatest Hits")[0]?.id).toBe("a");
    expect(rankMusicTracks([base("b", "Other", "Other", "Other"), base("a", "Song", "Artist", "Album")], "Song")[0]?.id).toBe("a");
    expect(rankMusicTracks([base("a", "Blue", "Artist", "Album"), base("b", "Blues", "Artist", "Album")], "blue")[0]?.id).toBe("a");
    expect(rankMusicTracks([base("b", "Live Set", "Artist", "Discovery Deluxe"), base("a", "Album Cut", "Artist", "Discovery")], "Discovery")[0]?.id).toBe("a");
  });

  it("returns a safe empty result when an external source is unavailable", () => {
    expect(emptySearchResult()).toMatchObject({ configured: true, source: "musicbrainz", items: [], total: 0, nextOffset: null });
  });

  it("falls back safely when MusicBrainz responds with 503", async () => {
    const request = vi.spyOn(axios, "get").mockRejectedValueOnce(Object.assign(new Error("Service unavailable"), { response: { status: 503 } }));
    await expect(searchMusic("Shakira", 0)).resolves.toMatchObject({ items: [], total: 0, nextOffset: null });
    request.mockRestore();
  });

  it("reports Spotify as unconfigured without exposing or inventing credentials", async () => {
    delete process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_SECRET;
    expect(await isSpotifyConfigured()).toBe(false);
    await expect(searchSpotify("test", 0)).resolves.toBeNull();
  });

  it("returns a clear setup state for lyrics without a Genius token", async () => {
    delete process.env.GENIUS_ACCESS_TOKEN;
    await expect(getGeniusLyrics("Song", "Artist")).resolves.toMatchObject({ status: "not_configured", text: null, sourceUrl: null });
  });
});
