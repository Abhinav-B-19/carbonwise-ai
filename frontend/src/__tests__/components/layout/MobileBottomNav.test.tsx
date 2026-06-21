import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import MobileBottomNav from "@/components/layout/MobileBottomNav";

vi.mock("@/components/layout/MobileMenu", () => ({
  default: ({ open, onClose }: any) =>
    open ? (
      <button type="button" aria-label="Close Menu" onClick={onClose}>
        Close Menu
      </button>
    ) : null,
}));

describe("MobileBottomNav", () => {
  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: /dashboard/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /calculator/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /goals/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /more options/i,
      }),
    ).toBeInTheDocument();
  });

  it("opens mobile menu when More is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /more options/i,
      }),
    );

    expect(
      screen.getByRole("button", {
        name: /close menu/i,
      }),
    ).toBeInTheDocument();
  });

  it("closes mobile menu", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /more options/i,
      }),
    );

    const closeButton = screen.getByRole("button", {
      name: /close menu/i,
    });

    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);

    expect(
      screen.queryByRole("button", {
        name: /close menu/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("renders dashboard as active route", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: /dashboard/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders calculator as active route", () => {
    render(
      <MemoryRouter initialEntries={["/calculator"]}>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: /calculator/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders goals as active route", () => {
    render(
      <MemoryRouter initialEntries={["/goals"]}>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: /goals/i,
      }),
    ).toBeInTheDocument();
  });

  it("marks dashboard link as active", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: /dashboard/i,
      }),
    ).toHaveClass("text-green-600");
  });

  it("marks calculator link as active", () => {
    render(
      <MemoryRouter initialEntries={["/calculator"]}>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: /calculator/i,
      }),
    ).toHaveClass("text-green-600");
  });

  it("marks goals link as active", () => {
    render(
      <MemoryRouter initialEntries={["/goals"]}>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: /goals/i,
      }),
    ).toHaveClass("text-green-600");
  });
});
