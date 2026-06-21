import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import DashboardPage from "../../pages/Dashboard/DashboardPage";

import api from "../../api/api";
import { getUserKey } from "../../services/localStorage";

vi.mock("../../api/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("../../services/localStorage", () => ({
  getUserKey: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("../../components/layout/DashboardLayout", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/layout/PageContainer", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/ui/PageLoader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("../../components/charts/EmissionTrendChart", () => ({
  default: ({ data }: any) => (
    <div>
      Emission Chart:
      {data.length}
    </div>
  ),
}));

vi.mock("../../components/charts/ScoreTrendChart", () => ({
  default: ({ data }: any) => (
    <div>
      Score Chart:
      {data.length}
    </div>
  ),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => "Abhinav"),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  const mockSuccess = (
    score = 85,
    level = "Eco Hero",
    history = [
      {
        carbonScore: 80,
      },
    ],
    achievements = ["A1", "A2", "A3", "A4", "A5", "A6"],
  ) => {
    vi.mocked(getUserKey).mockReturnValue("user-123");

    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          carbonScore: score,
          averageEmission: 10,
          latestEmission: 12,
          activeGoals: 3,
          totalCalculations: 7,
        },
      })
      .mockResolvedValueOnce({
        data: history,
      })
      .mockResolvedValueOnce({
        data: {
          greenPoints: 500,
          currentStreak: 12,
          level,
          achievements,
        },
      });
  };

  it("shows loader initially", () => {
    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}) as any);

    render(<DashboardPage />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders dashboard successfully", async () => {
    mockSuccess();

    render(<DashboardPage />);

    expect(await screen.findByText(/Welcome Back/i)).toBeInTheDocument();

    expect(screen.getByText(/Abhinav/i)).toBeInTheDocument();

    expect(screen.getByText(/12 Day Streak/i)).toBeInTheDocument();

    expect(screen.getByText(/500 Points/i)).toBeInTheDocument();

    expect(screen.getByText(/Level 🎯 Eco Hero/i)).toBeInTheDocument();

    expect(screen.getByText(/7 Sustainability Checkups/i)).toBeInTheDocument();

    expect(screen.getByText("10.00")).toBeInTheDocument();

    expect(screen.getByText("12.00")).toBeInTheDocument();

    expect(
      screen.getByText((_, el) => el?.textContent === "3"),
    ).toBeInTheDocument();

    expect(screen.getByText("85/100")).toBeInTheDocument();

    expect(screen.getByText("Eco Champion")).toBeInTheDocument();

    expect(screen.getByText("Emission Chart:1")).toBeInTheDocument();

    expect(screen.getByText("Score Chart:1")).toBeInTheDocument();

    expect(screen.getByText(/Recent Achievements/i)).toBeInTheDocument();

    expect(screen.queryByText("A6")).not.toBeInTheDocument();

    expect(screen.getByText("Calculator")).toBeInTheDocument();

    expect(screen.getByText("Goals")).toBeInTheDocument();

    expect(screen.getByText("AI Coach")).toBeInTheDocument();

    expect(screen.getByText("Scenario")).toBeInTheDocument();

    expect(screen.getByText(/Rewards Snapshot/i)).toBeInTheDocument();
  });

  it.each([
    [85, "Eco Champion"],
    [65, "Green Explorer"],
    [45, "Eco Starter"],
    [25, "Getting Started"],
    [10, "Getting Started"],
  ])("renders score level %i -> %s", async (score, label) => {
    mockSuccess(score);

    render(<DashboardPage />);

    expect(await screen.findByText(label)).toBeInTheDocument();

    cleanup();
  });

  it("uses defaults when data is missing", async () => {
    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {},
      })
      .mockResolvedValueOnce({
        data: null,
      })
      .mockResolvedValueOnce({
        data: {
          greenPoints: 0,
          currentStreak: 0,
          level: "",
          achievements: [],
        },
      });

    render(<DashboardPage />);

    await screen.findByText(/Welcome Back/i);

    expect(screen.getByText("0/100")).toBeInTheDocument();

    expect(screen.getAllByText("0.00")).toHaveLength(2);

    expect(screen.getByText("Getting Started")).toBeInTheDocument();

    expect(screen.queryByText(/Recent Achievements/i)).not.toBeInTheDocument();
  });

  it("handles missing user key", async () => {
    vi.mocked(getUserKey).mockReturnValue(null as any);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(api.get).not.toHaveBeenCalled();
    });

    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  });

  it("handles api failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.mocked(api.get).mockRejectedValue(new Error("failed"));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });

  it("handles undefined achievements", async () => {
    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {},
      })
      .mockResolvedValueOnce({
        data: [],
      })
      .mockResolvedValueOnce({
        data: {
          greenPoints: 0,
          currentStreak: 0,
          level: "",
          achievements: undefined,
        },
      });

    render(<DashboardPage />);

    await screen.findByText(/Welcome Back/i);

    expect(screen.queryByText(/Recent Achievements/i)).not.toBeInTheDocument();
  });

  it("uses Eco Warrior when username is not in localStorage", async () => {
    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    mockSuccess();

    render(<DashboardPage />);

    expect(await screen.findByText(/Welcome Back/i)).toBeInTheDocument();

    expect(screen.getByText(/Eco Warrior/i)).toBeInTheDocument();
  });

  it("uses gamification fallback when response data is undefined", async () => {
    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {},
      })
      .mockResolvedValueOnce({
        data: [],
      })
      .mockResolvedValueOnce(undefined as any);

    render(<DashboardPage />);

    await screen.findByText(/Welcome Back/i);

    expect(screen.queryByText(/Recent Achievements/i)).not.toBeInTheDocument();
  });

  it("uses dashboard fallback when dashboard response is undefined", async () => {
    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.mocked(api.get)
      .mockResolvedValueOnce(undefined as any)
      .mockResolvedValueOnce({
        data: [],
      })
      .mockResolvedValueOnce({
        data: {
          greenPoints: 0,
          currentStreak: 0,
          level: "",
          achievements: [],
        },
      });

    render(<DashboardPage />);

    await screen.findByText(/Welcome Back/i);

    expect(screen.getByText("0/100")).toBeInTheDocument();

    expect(screen.getAllByText("0.00")).toHaveLength(2);

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
  });

  it("renders charts with empty history", async () => {
    mockSuccess(85, "Eco Hero", [], []);

    render(<DashboardPage />);

    await screen.findByText(/Welcome Back/i);

    expect(screen.getByText("Emission Chart:0")).toBeInTheDocument();

    expect(screen.getByText("Score Chart:0")).toBeInTheDocument();
  });
});
