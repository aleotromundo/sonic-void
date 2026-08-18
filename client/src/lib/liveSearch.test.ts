import { describe, expect, it } from "vitest";
import { getLiveSearchQuery } from "./liveSearch";

describe("getLiveSearchQuery", () => {
  it("ignora entradas vacías o demasiado cortas", () => {
    expect(getLiveSearchQuery("", "")).toBeNull();
    expect(getLiveSearchQuery("a", "")).toBeNull();
  });

  it("normaliza espacios y activa una consulta nueva", () => {
    expect(getLiveSearchQuery("  Shakira   ", "")).toBe("Shakira");
  });

  it("no repite la consulta ya enviada", () => {
    expect(getLiveSearchQuery("Shakira", "Shakira")).toBeNull();
  });
});
