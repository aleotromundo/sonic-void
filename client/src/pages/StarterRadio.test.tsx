// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { StarterRadio, type Track } from "./Home";

const playableTrack: Track = {
  id: "starter-1",
  source: "jamendo",
  kind: "track",
  name: "Night Signal",
  artist: "Open Frequency",
  album: "Afterglow",
  releaseYear: "2024",
  durationMs: 180000,
  durationLabel: "3:00",
  popularity: 70,
  imageUrl: null,
  spotifyUrl: "https://example.com/source",
  previewUrl: "https://example.com/audio.mp3",
  availableMarkets: [],
  licenseLabel: "Creative Commons",
  attribution: "Open Frequency",
  licenseUrl: "https://creativecommons.org/licenses/",
};

describe("StarterRadio", () => {
  it("shows entry playlists and playable recommendations", () => {
    const onSearch = vi.fn();
    const onPlay = vi.fn();
    render(<StarterRadio stations={[{ name: "Afterglow", query: "lofi chill", detail: "Lo-fi", tracks: [playableTrack] }]} loading={false} onSearch={onSearch} onPlay={onPlay} />);

    expect(screen.getByText("Playlists para entrar directo")).toBeTruthy();
    expect(screen.getByText("Night Signal")).toBeTruthy();
    expect(screen.getAllByText("Open Frequency").length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole("button", { name: /Afterglow/i })[0]);
    expect(onSearch).toHaveBeenCalledWith("lofi chill");
    fireEvent.click(screen.getByRole("button", { name: /Play · Afterglow/i }));
    expect(onPlay).toHaveBeenCalledWith(playableTrack);
  });
});
