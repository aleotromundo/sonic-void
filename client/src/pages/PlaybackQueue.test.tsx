// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlaybackQueue } from "./Home";

const playable = {
  id: "jamendo-queue-1",
  source: "jamendo" as const,
  kind: "track" as const,
  name: "Available Signal",
  artist: "Open Artist",
  album: "Jamendo single",
  releaseYear: "2026",
  durationMs: 180000,
  durationLabel: "3:00",
  popularity: 10,
  imageUrl: null,
  spotifyUrl: "https://www.jamendo.com/track/jamendo-queue-1",
  previewUrl: "https://prod-1.storage.jamendo.com/available.mp3",
  availableMarkets: [],
  licenseLabel: "Creative Commons / Jamendo",
  attribution: "Open Artist · Jamendo",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
};

const unavailable = { ...playable, id: "musicbrainz-1", name: "Metadata Only", previewUrl: null, source: "musicbrainz" as const, licenseLabel: "Sin audio reproducible", attribution: "MusicBrainz", licenseUrl: "https://musicbrainz.org/recording/musicbrainz-1" };

afterEach(() => cleanup());

describe("PlaybackQueue", () => {
  it("shows only playable tracks with license and attribution", () => {
    render(<PlaybackQueue items={[playable, unavailable]} suggestions={[]} onPlay={vi.fn()} onRemove={vi.fn()} onClear={vi.fn()} onExplore={vi.fn()} />);
    expect(screen.getByText("Available Signal")).toBeInTheDocument();
    expect(screen.queryByText("Metadata Only")).toBeNull();
    expect(screen.getByText("Creative Commons / Jamendo")).toBeInTheDocument();
    expect(screen.getByText("Atribución: Open Artist · Jamendo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver licencia/fuente" })).toHaveAttribute("href", "https://creativecommons.org/licenses/by/4.0/");
  });

  it("keeps a responsive grid structure for desktop and mobile", () => {
    render(<PlaybackQueue items={[playable]} suggestions={[]} onPlay={vi.fn()} onRemove={vi.fn()} onClear={vi.fn()} onExplore={vi.fn()} />);
    const card = screen.getByText("Available Signal").closest("article");
    expect(card?.parentElement).toHaveClass("grid", "sm:grid-cols-2", "lg:grid-cols-4");
  });

  it("offers playable suggestions when the queue is empty", () => {
    render(<PlaybackQueue items={[]} suggestions={[unavailable, playable]} onPlay={vi.fn()} onRemove={vi.fn()} onClear={vi.fn()} onExplore={vi.fn()} />);
    expect(screen.getByText("Available Signal")).toBeInTheDocument();
    expect(screen.queryByText("Metadata Only")).toBeNull();
    expect(screen.getByText("0 en cola")).toBeInTheDocument();
  });
});
