// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchFiltersPanel } from "./Home";

afterEach(() => cleanup());

describe("SearchFiltersPanel", () => {
  it("exposes optional combined country, genre, movement and year controls", () => {
    const onChange = vi.fn();
    render(<SearchFiltersPanel filters={{ country: "", genre: "", movement: "", yearFrom: "", yearTo: "" }} onChange={onChange} />);
    expect(screen.getByRole("combobox", { name: "País o mercado" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Género" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Movimiento" })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Año desde" })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Año hasta" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "País o mercado" }), { target: { value: "AR" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Género" }), { target: { value: "rock" } });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Año desde" }), { target: { value: "2000" } });
    expect(onChange).toHaveBeenCalledWith("country", "AR");
    expect(onChange).toHaveBeenCalledWith("genre", "rock");
    expect(onChange).toHaveBeenCalledWith("yearFrom", "2000");
  });
});

export {};
