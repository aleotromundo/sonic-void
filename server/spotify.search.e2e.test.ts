import { describe, expect, it } from "vitest";
import { searchMusic } from "./music";

describe("Spotify search integration", () => {
  it("uses Spotify when the endpoint is allowed and otherwise falls back safely", async () => {
    const result = await searchMusic("Daft Punk", 0, 1);
    expect(result.configured).toBe(true);
    expect(["spotify", "musicbrainz"]).toContain(result.source);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0]?.name).toBeTruthy();
  }, 20_000);
});
