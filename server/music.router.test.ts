import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("axios", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

import axios from "axios";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(): TrpcContext {
  return { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

const mockedGet = vi.mocked(axios.get);

beforeEach(() => {
  delete process.env.SPOTIFY_CLIENT_ID;
  delete process.env.SPOTIFY_CLIENT_SECRET;
  delete process.env.GENIUS_ACCESS_TOKEN;
  mockedGet.mockReset();
  mockedGet.mockResolvedValue({ data: { count: 1, recordings: [{ id: "mbid-1", title: "Test Song", length: 180000, "artist-credit": [{ name: "Test Artist" }], releases: [{ title: "Test Album", date: "2020-01-01", "release-group": { id: "group-1" } }] }] } } as any);
});

describe("music tRPC procedures", () => {
  it("falls back to MusicBrainz when Spotify is not configured", async () => {
    const result = await appRouter.createCaller(context()).music.search({ query: "test", offset: 0 });
    expect(result).toMatchObject({ configured: true, source: "musicbrainz", total: 1 });
    expect(result.items[0]).toMatchObject({ name: "Test Song", artist: "Test Artist", source: "musicbrainz", imageUrl: "https://coverartarchive.org/release-group/group-1/front-500" });
  });

  it("returns an explicit unconfigured result for lyrics", async () => {
    const result = await appRouter.createCaller(context()).music.lyrics({ name: "Song", artist: "Artist" });
    expect(result).toMatchObject({ status: "not_configured", text: null, sourceUrl: null });
  });
});
