import type { Request, Response } from "express";
import { createServerApp } from "../server/_core/index";

let appPromise: ReturnType<typeof createServerApp> | undefined;

export default async function handler(req: Request, res: Response) {
  appPromise ??= createServerApp({ serveClient: false });
  const { app } = await appPromise;
  return app(req, res);
}
