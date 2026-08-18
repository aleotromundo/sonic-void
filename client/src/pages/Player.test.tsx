// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Player } from "./Home";

const track = { id: "audius-1", source: "audius" as const, kind: "track" as const, name: "Open Signal", artist: "Open Artist", album: "Audius", releaseYear: "2024", durationMs: 120000, durationLabel: "2:00", popularity: 0, imageUrl: null, spotifyUrl: "https://audius.co/open-artist/open-signal", previewUrl: "https://api.audius.co/v1/tracks/audius-1/stream", availableMarkets: [] };
const baseProps = { active: true, track, lyricLine: undefined, currentTime: 0, duration: 0, volume: 0.8, onTimeUpdate: vi.fn(), onLoadedMetadata: vi.fn(), onVolumeChange: vi.fn(), onNext: vi.fn(), onPrevious: vi.fn(), onClose: vi.fn() };

afterEach(() => cleanup());

beforeEach(() => { vi.restoreAllMocks(); vi.stubGlobal("MediaMetadata", class { constructor(public readonly init: unknown) {} }); vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined); vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined); Object.defineProperty(window.navigator, "mediaSession", { configurable: true, value: { metadata: null, setActionHandler: vi.fn() } }); });

describe("Player", () => {
  it("renders an audio element and invokes Play/Pause callback", () => {
    const onPlay = vi.fn();
    render(<Player {...baseProps} isPlaying={false} onPlay={onPlay} onPlaybackError={vi.fn()} />);
    expect(document.querySelector("audio")).toHaveAttribute("src", track.previewUrl);
    fireEvent.click(screen.getByTitle("Reproducir preview"));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("shows an explicit unavailable state without rendering audio", () => {
    render(<Player {...baseProps} track={{ ...track, previewUrl: null }} isPlaying={false} onPlay={vi.fn()} onPlaybackError={vi.fn()} />);
    expect(screen.getByText("Preview no disponible")).toBeInTheDocument();
    expect(document.querySelector("audio")).toBeNull();
  });

  it("reports an HTMLAudioElement error", async () => {
    const onPlaybackError = vi.fn();
    render(<Player {...baseProps} isPlaying={false} onPlay={vi.fn()} onPlaybackError={onPlaybackError} />);
    const audio = document.querySelector("audio");
    expect(audio).not.toBeNull();
    fireEvent.error(audio!);
    await waitFor(() => expect(onPlaybackError).toHaveBeenCalledTimes(1));
  });
});
