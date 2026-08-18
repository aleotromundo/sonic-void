import { describe, expect, it } from "vitest";
import { getGeniusLyrics, isSpotifyConfigured, searchSpotify } from "./music";

describe("music integrations", () => {
  it("reports Spotify as unconfigured without exposing or inventing credentials", async () => {
    delete process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_SECRET;
    expect(await isSpotifyConfigured()).toBe(false);
    await expect(searchSpotify("test", 0)).resolves.toMatchObject({ configured: false, items: [], total: 0 });
  });

  it("returns a clear setup state for lyrics without a Genius token", async () => {
    delete process.env.GENIUS_ACCESS_TOKEN;
    await expect(getGeniusLyrics("Song", "Artist")).resolves.toMatchObject({ status: "not_configured", text: null, sourceUrl: null });
  });
});
