import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import { emptySearchResult, getGeniusLyrics, interpretQuery, isSpotifyConfigured, matchesAudioCandidate, matchesAudioQuery, rankMusicTracks, searchMusic, searchSpotify } from "./music";

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

  it("matches fallback audio by artist, title and duration", () => {
    const primary = { id: "primary", source: "musicbrainz" as const, kind: "track" as const, name: "Hips Don't Lie", artist: "Shakira", album: "Laundry Service", releaseDate: "2001", releaseYear: "2001", durationMs: 218000, durationLabel: "3:38", popularity: 0, imageUrl: null, spotifyUrl: "https://musicbrainz.org", previewUrl: null, availableMarkets: [] };
    const fallback = { ...primary, id: "fallback", source: "audius" as const, spotifyUrl: "https://audius.co/shakira/hips-dont-lie", previewUrl: "https://api.audius.co/v1/tracks/fallback/stream" };
    const wrong = { ...fallback, name: "Completely Different Song", durationMs: 90000 };
    const falsePositive = { ...fallback, artist: "DJ Real", name: "Shakira Mega Mix" };
    expect(matchesAudioCandidate(primary, fallback, "Shakira")).toBe(true);
    expect(matchesAudioCandidate(primary, wrong, "Shakira")).toBe(false);
    expect(matchesAudioCandidate(primary, falsePositive, "Shakira")).toBe(false);
  });

  it("matches fallback audio by query words", () => {
    const track = { id: "audius-1", source: "audius" as const, kind: "track" as const, name: "Daft Punk One More Time Remix", artist: "Open Artist", album: "Audius", releaseDate: "2024", releaseYear: "2024", durationMs: 120000, durationLabel: "2:00", popularity: 0, imageUrl: null, spotifyUrl: "https://audius.co/open-artist/open-signal", previewUrl: "https://api.audius.co/v1/tracks/audius-1/stream", availableMarkets: [] };
    expect(matchesAudioQuery(track, "Daft Punk")).toBe(true);
    expect(matchesAudioQuery(track, "Shakira")).toBe(false);
  });

  it("uses Audius when the primary catalog has no playable preview", async () => {
    const request = vi.spyOn(axios, "get");
    request.mockResolvedValueOnce({ data: { artists: [{ id: "artist-1", name: "Shakira" }] } });
    request.mockResolvedValueOnce({ data: { "release-groups": [], "release-group-count": 0 } });
    request.mockResolvedValueOnce({ data: { recordings: [{ id: "recording-1", title: "Hips Don't Lie", length: 218000, "artist-credit": [{ name: "Shakira" }], releases: [] }], count: 1 } });
    request.mockResolvedValueOnce({ data: { data: [{ id: "audius-1", title: "Hips Don't Lie", duration: 218, release_date: "2024-01-01T00:00:00Z", user: { name: "Shakira", handle: "shakira" }, permalink: "open-artist/open-signal", artwork: { "1000x1000": "https://example.com/art.jpg" } }], total: 1 } });
    await expect(searchMusic("Shakira", 0)).resolves.toMatchObject({ source: "audius", items: [{ id: "audius-1", previewUrl: "https://api.audius.co/v1/tracks/audius-1/stream" }] });
    request.mockRestore();
  });

  it("falls back safely when MusicBrainz responds with 503", async () => {
    const request = vi.spyOn(axios, "get").mockRejectedValue(Object.assign(new Error("Service unavailable"), { response: { status: 503 } }));
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
