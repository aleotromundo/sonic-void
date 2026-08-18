import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("music tRPC procedures", () => {
  it("returns an explicit unconfigured result for search", async () => {
    delete process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_SECRET;
    const result = await appRouter.createCaller(context()).music.search({ query: "test", offset: 0 });
    expect(result).toMatchObject({ configured: false, items: [], total: 0, nextOffset: null });
  });

  it("returns an explicit unconfigured result for lyrics", async () => {
    delete process.env.GENIUS_ACCESS_TOKEN;
    const result = await appRouter.createCaller(context()).music.lyrics({ name: "Song", artist: "Artist" });
    expect(result).toMatchObject({ status: "not_configured", text: null, sourceUrl: null });
  });
});
