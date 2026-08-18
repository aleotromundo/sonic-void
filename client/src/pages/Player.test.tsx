// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioVisualizer, Player, spectrumToBarLevel } from "./Home";

const track = { id: "audius-1", source: "audius" as const, kind: "track" as const, name: "Open Signal", artist: "Open Artist", album: "Audius", releaseYear: "2024", durationMs: 120000, durationLabel: "2:00", popularity: 0, imageUrl: null, spotifyUrl: "https://audius.co/open-artist/open-signal", previewUrl: "https://api.audius.co/v1/tracks/audius-1/stream", availableMarkets: [], licenseLabel: "Licencia indicada por el creador", attribution: "Open Artist · Audius", licenseUrl: "https://audius.co/open-artist/open-signal" };
const baseProps = { active: true, track, lyricLine: undefined, currentTime: 0, duration: 0, volume: 0.8, onTimeUpdate: vi.fn(), onLoadedMetadata: vi.fn(), onVolumeChange: vi.fn(), onNext: vi.fn(), onPrevious: vi.fn(), onClose: vi.fn() };

afterEach(() => cleanup());

beforeEach(() => { vi.restoreAllMocks(); vi.stubGlobal("MediaMetadata", class { constructor(public readonly init: unknown) {} }); vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined); vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined); Object.defineProperty(window.navigator, "mediaSession", { configurable: true, value: { metadata: null, setActionHandler: vi.fn() } }); });

describe("Player", () => {
  it("maps frequency levels to bounded bar heights and keeps responsive classes", () => {
    expect(spectrumToBarLevel(1, 0.5)).toBeGreaterThan(spectrumToBarLevel(0, 0.5));
    expect(spectrumToBarLevel(5, 0.5)).toBe(spectrumToBarLevel(1, 0.5));
    expect(spectrumToBarLevel(-1, 0.5)).toBe(spectrumToBarLevel(0, 0.5));
    render(<AudioVisualizer isPlaying={false} currentTime={0} />);
    expect(screen.getByRole("img")).toHaveClass("w-16", "sm:w-28");
  });

  it("exposes distinct visualizer states for pause and playback", () => {
    const { rerender } = render(<AudioVisualizer isPlaying={false} currentTime={0} />);
    expect(screen.getByRole("img", { name: "Ecualizador visual en pausa" })).toBeInTheDocument();
    rerender(<AudioVisualizer isPlaying currentTime={12} />);
    expect(screen.getByRole("img", { name: "Ecualizador visual activo" })).toBeInTheDocument();
  });

  it("renders an audio element and invokes Play/Pause callback", () => {
    const onPlay = vi.fn();
    render(<Player {...baseProps} isPlaying={false} onPlay={onPlay} onPlaybackError={vi.fn()} />);
    expect(document.querySelector("audio")).toHaveAttribute("src", track.previewUrl);
    fireEvent.click(screen.getByTitle("Reproducir preview"));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("shows Jamendo as the active playable source", () => {
    render(<Player {...baseProps} track={{ ...track, source: "jamendo" }} isPlaying={false} onPlay={vi.fn()} onPlaybackError={vi.fn()} />);
    expect(screen.getByText("Fuente: jamendo")).toBeInTheDocument();
    expect(document.querySelector("audio")).toHaveAttribute("src", track.previewUrl);
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
