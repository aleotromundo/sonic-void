import { describe, expect, it } from "vitest";
import { getPlaybackAvailability, getPlaybackErrorMessage } from "./playbackState";

describe("playback state", () => {
  it("marks an authorized preview as ready", () => {
    expect(getPlaybackAvailability("https://api.audius.co/v1/tracks/demo/stream")).toBe("ready");
  });

  it("marks missing preview as unavailable", () => {
    expect(getPlaybackAvailability(null)).toBe("unavailable");
    expect(getPlaybackAvailability("")).toBe("unavailable");
  });

  it("explains autoplay permission errors", () => {
    const error = new DOMException("User gesture required", "NotAllowedError");
    expect(getPlaybackErrorMessage(error)).toContain("interacción");
    expect(getPlaybackErrorMessage(new Error("network"))).toContain("no pudo cargar");
  });
});
