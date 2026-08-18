import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getGeniusLyrics, isSpotifyConfigured, searchMusic } from "./music";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  music: router({
    status: publicProcedure.query(async () => ({ spotifyConfigured: await isSpotifyConfigured() })),
    search: publicProcedure
      .input(z.object({ query: z.string().trim().min(1).max(120), offset: z.number().int().min(0).max(1000).default(0) }))
      .query(async ({ input }) => ({ query: input.query, ...(await searchMusic(input.query, input.offset)) })),
    lyrics: publicProcedure
      .input(z.object({ name: z.string().min(1).max(200), artist: z.string().min(1).max(200) }))
      .query(async ({ input }) => getGeniusLyrics(input.name, input.artist)),
  }),
});

export type AppRouter = typeof appRouter;
