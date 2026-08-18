// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FullSignal } from "./FullSignal";

describe("FullSignal", () => {
  it("opens the immersive dialog and keeps a canvas fallback available", () => {
    render(<FullSignal isPlaying audioElement={null} reducedMotion={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir modo Full Signal" }));

    expect(screen.getByRole("dialog", { name: "Visualizador inmersivo Full Signal" })).toBeTruthy();
    expect(screen.getByLabelText("Visualizador de profundidad reactivo")).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Intensidad visual" })).toBeTruthy();
  });

  it("does not offer the animated entry point when reduced motion is enabled", () => {
    render(<FullSignal isPlaying audioElement={null} reducedMotion />);
    const button = screen.getByRole("button", { name: "Abrir modo Full Signal" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
