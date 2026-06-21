import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import LandingPage from "../../pages/Landing/LandingPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LandingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders hero section", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("CarbonWise AI")).toBeInTheDocument();

    expect(
      screen.getByText(/measure your carbon footprint/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /get started/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders all feature cards", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Carbon Tracking")).toBeInTheDocument();

    expect(screen.getByText("AI Coach")).toBeInTheDocument();

    expect(screen.getByText("Gamification")).toBeInTheDocument();
  });

  it("navigates to register when no user key exists", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /get started/i,
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it("navigates to dashboard when user key exists", async () => {
    const user = userEvent.setup();

    localStorage.setItem("carbonwise_userKey", "abc123");

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /get started/i,
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
