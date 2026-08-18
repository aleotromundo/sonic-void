import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import { applySearchFilters, emptySearchResult, getGeniusLyrics, interpretQuery, isSpotifyConfigured, matchesAudioCandidate, matchesAudioQuery, matchesJamendoCandidate, matchesJamendoQuery, rankMusicTracks, searchMusic, searchSpotify } from "./music";

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

  it("filters tracks by market and release year without inventing availability", () => {
    const tracks = [
      { id: "us-2020", source: "spotify" as const, kind: "track" as const, name: "US 2020", artist: "Artist", album: "Album", releaseDate: "2020", releaseYear: "2020", durationMs: 1000, durationLabel: "0:01", popularity: 0, imageUrl: null, spotifyUrl: "https://open.spotify.com/track/us-2020", previewUrl: "https://audio.example/us.mp3", availableMarkets: ["US"], licenseLabel: "Preview", attribution: "Spotify", licenseUrl: null },
      { id: "ar-2022", source: "spotify" as const, kind: "track" as const, name: "AR 2022", artist: "Artist", album: "Album", releaseDate: "2022", releaseYear: "2022", durationMs: 1000, durationLabel: "0:01", popularity: 0, imageUrl: null, spotifyUrl: "https://open.spotify.com/track/ar-2022", previewUrl: "https://audio.example/ar.mp3", availableMarkets: ["AR"], licenseLabel: "Preview", attribution: "Spotify", licenseUrl: null },
      { id: "unknown", source: "audius" as const, kind: "track" as const, name: "Unknown market", artist: "Artist", album: "Album", releaseDate: "2021", releaseYear: "2021", durationMs: 1000, durationLabel: "0:01", popularity: 0, imageUrl: null, spotifyUrl: "https://audius.co/artist/unknown", previewUrl: "https://audio.example/unknown.mp3", availableMarkets: [], licenseLabel: "Creator license", attribution: "Artist", licenseUrl: null },
    ];
    expect(applySearchFilters(tracks, { country: "US", yearFrom: 2020, yearTo: 2021 }).map(track => track.id)).toEqual(["us-2020", "unknown"]);
    expect(applySearchFilters(tracks, { country: "AR", yearFrom: 2022 }).map(track => track.id)).toEqual(["ar-2022"]);
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
    process.env.SPOTIFY_CLIENT_ID = "";
    process.env.SPOTIFY_CLIENT_SECRET = "";
    const request = vi.spyOn(axios, "get");
    request.mockResolvedValueOnce({ data: { artists: [{ id: "artist-1", name: "Shakira" }] } });
    request.mockResolvedValueOnce({ data: { "release-groups": [], "release-group-count": 0 } });
    request.mockResolvedValueOnce({ data: { recordings: [{ id: "recording-1", title: "Hips Don't Lie", length: 218000, "artist-credit": [{ name: "Shakira" }], releases: [] }], count: 1 } });
    request.mockResolvedValueOnce({ data: { data: [{ id: "audius-1", title: "Hips Don't Lie", duration: 218, release_date: "2024-01-01T00:00:00Z", user: { name: "Shakira", handle: "shakira" }, permalink: "open-artist/open-signal", artwork: { "1000x1000": "https://example.com/art.jpg" } }], total: 1 } });
    await expect(searchMusic("Shakira", 0)).resolves.toMatchObject({ source: "audius", items: [{ id: "audius-1", previewUrl: "https://api.audius.co/v1/tracks/audius-1/stream" }] });
    request.mockRestore();
  });

  it("uses Jamendo when Audius has no related playable result", async () => {
    process.env.SPOTIFY_CLIENT_ID = "";
    process.env.SPOTIFY_CLIENT_SECRET = "";
    process.env.JAMENDO_CLIENT_ID = "test-client";
    const request = vi.spyOn(axios, "get");
    request.mockResolvedValueOnce({ data: { artists: [{ id: "artist-2", name: "Creative Artist" }] } });
    request.mockResolvedValueOnce({ data: { "release-groups": [], "release-group-count": 0 } });
    request.mockResolvedValueOnce({ data: { recordings: [{ id: "recording-2", title: "Open Signal", length: 180000, "artist-credit": [{ name: "Creative Artist" }], releases: [] }], count: 1 } });
    request.mockResolvedValueOnce({ data: { data: [], total: 0 } });
    request.mockResolvedValueOnce({ data: { headers: { results_count: 1, status: "success" }, results: [{ id: "jamendo-1", name: "Open Signal", duration: 180, artist_name: "Creative Artist", album_name: "Open Album", releasedate: "2024-01-01", image: "https://usercontent.jamendo.com/image.jpg", audio: "https://prod-1.storage.jamendo.com/?trackid=jamendo-1&format=mp31", shareurl: "https://www.jamendo.com/track/jamendo-1", license_ccurl: "https://creativecommons.org/licenses/by-nc-nd/3.0/" }] } });
    await expect(searchMusic("Creative Artist", 0)).resolves.toMatchObject({ source: "jamendo", items: [{ id: "jamendo-1", previewUrl: "https://prod-1.storage.jamendo.com/?trackid=jamendo-1&format=mp31", imageUrl: "https://usercontent.jamendo.com/image.jpg", spotifyUrl: "https://www.jamendo.com/track/jamendo-1" }] });
    const validJamendo = { id: "jamendo-1", source: "jamendo" as const, kind: "track" as const, name: "Open Signal", artist: "Creative Artist", album: "Open Album", releaseDate: "2024", releaseYear: "2024", durationMs: 180000, durationLabel: "3:00", popularity: 0, imageUrl: null, spotifyUrl: "https://www.jamendo.com/track/jamendo-1", previewUrl: "https://example.com/audio.mp3", availableMarkets: [] };
    const primary = [{ ...validJamendo, id: "primary", source: "musicbrainz" as const, previewUrl: null }];
    const falsePositive = { ...validJamendo, artist: "Other Artist", name: "Creative Artist Mega Mix" };
    expect(matchesJamendoQuery(validJamendo, interpretQuery("Creative Artist"), "Creative Artist")).toBe(true);
    expect(matchesJamendoCandidate(primary, validJamendo, interpretQuery("Creative Artist"), "Creative Artist")).toBe(true);
    expect(matchesJamendoCandidate(primary, falsePositive, interpretQuery("Creative Artist"), "Creative Artist")).toBe(false);
    const freePrimary = [{ ...primary[0], name: "Unrelated Primary Track", artist: "Different Artist", durationMs: 90000 }];
    const semanticJamendo = { ...validJamendo, name: "Ambient Instrumental Relaxing Music", artist: "StimiBeats" };
    expect(matchesJamendoCandidate(freePrimary, semanticJamendo, interpretQuery("ambient instrumental relaxing music"), "ambient instrumental relaxing music")).toBe(true);
    request.mockRestore();
  });

  it("ignores an invalid Jamendo payload safely", async () => {
    process.env.JAMENDO_CLIENT_ID = "test-client";
    process.env.SPOTIFY_CLIENT_ID = "";
    process.env.SPOTIFY_CLIENT_SECRET = "";
    const request = vi.spyOn(axios, "get");
    request.mockRejectedValueOnce(new Error("MusicBrainz unavailable"));
    request.mockRejectedValueOnce(new Error("Audius unavailable"));
    request.mockResolvedValueOnce({ data: { headers: { status: "success" }, results: [{ id: "missing-audio", name: "No stream", artist_name: "Unknown" }] } });
    await expect(searchMusic("ambient instrumental relaxing music", 0)).resolves.toMatchObject({ items: [], total: 0 });
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
