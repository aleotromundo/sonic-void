import express, { type Express } from "express";
import type { Request, Response } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";

let app: Express | undefined;

function createVercelApp() {
  const instance = express();
  instance.use(express.json({ limit: "50mb" }));
  instance.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(instance);
  registerOAuthRoutes(instance);
  instance.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  return instance;
}

export default function handler(req: Request, res: Response) {
  app ??= createVercelApp();
  return app(req, res);
}
