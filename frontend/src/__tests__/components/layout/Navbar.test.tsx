import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

describe("Navbar", () => {
  const renderNavbar = () =>
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

  it("renders brand name", () => {
    renderNavbar();

    expect(screen.getByText("CarbonWise AI")).toBeInTheDocument();
  });

  it("renders Get Started button", () => {
    renderNavbar();

    expect(
      screen.getByRole("link", {
        name: /Get Started/i,
      }),
    ).toBeInTheDocument();
  });

  it("has home link pointing to root route", () => {
    renderNavbar();

    const brandLink = screen.getByText("CarbonWise AI").closest("a");

    expect(brandLink).toHaveAttribute("href", "/");
  });

  it("has Get Started link pointing to register route", () => {
    renderNavbar();

    const startLink = screen.getByRole("link", {
      name: /Get Started/i,
    });

    expect(startLink).toHaveAttribute("href", "/register");
  });

  it("renders exactly two navigation links", () => {
    renderNavbar();

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
