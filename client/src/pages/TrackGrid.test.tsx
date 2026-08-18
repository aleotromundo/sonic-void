// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TrackGrid } from "./Home";

afterEach(() => cleanup());

describe("TrackGrid Jamendo", () => {
  it("renders the visible discovery label and playable action", () => {
    render(
      <TrackGrid
        tracks={[{
          id: "jamendo-1",
          source: "jamendo",
          kind: "track",
          name: "Ethereal Ambient",
          artist: "Open Artist",
          album: "Jamendo single",
          releaseYear: "2026",
          durationMs: 180000,
          durationLabel: "3:00",
          popularity: 20,
          imageUrl: null,
          spotifyUrl: "https://www.jamendo.com/track/jamendo-1",
          previewUrl: "https://prod-1.storage.jamendo.com/stream.mp3",
          availableMarkets: [],
          licenseLabel: "Creative Commons / Jamendo",
          attribution: "Open Artist · Jamendo",
          licenseUrl: "https://www.jamendo.com/track/jamendo-1",
          matchMode: "discovery",
        }, {
          id: "musicbrainz-no-audio",
          source: "musicbrainz",
          kind: "track",
          name: "Metadata Only",
          artist: "No Stream Artist",
          album: "Catalog",
          releaseYear: "2026",
          durationMs: 120000,
          durationLabel: "2:00",
          popularity: 0,
          imageUrl: null,
          spotifyUrl: "https://musicbrainz.org/recording/no-audio",
          previewUrl: null,
          availableMarkets: [],
          licenseLabel: "Sin audio reproducible",
          attribution: "MusicBrainz",
          licenseUrl: "https://musicbrainz.org/recording/no-audio",
        }]}
        favorites={[]}
        onFavorite={vi.fn()}
        onQueue={vi.fn()}
        onPlaylist={vi.fn()}
        onSelect={vi.fn()}
        onPlay={vi.fn()}
      />,
    );

    expect(screen.getByText("Jamendo · descubrimiento")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reproducir Ethereal Ambient" })).toBeTruthy();
    expect(screen.queryByText("Metadata Only")).toBeNull();
  });
});
