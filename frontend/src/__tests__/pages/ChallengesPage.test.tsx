import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import ChallengesPage from "./../../pages/Challenges/ChallengesPage";

import api from "../../api/api";
import toast from "react-hot-toast";
import { getUserKey } from "../../services/localStorage";

vi.mock("../../api/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../services/localStorage", () => ({
  getUserKey: vi.fn(),
}));

vi.mock("../../components/layout/DashboardLayout", () => ({
  default: ({ children }: any) => <div data-testid="dashboard">{children}</div>,
}));

vi.mock("../../components/layout/PageContainer", () => ({
  default: ({ children }: any) => <div data-testid="container">{children}</div>,
}));

vi.mock("../../components/ui/PageLoader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("../../components/cards/ChallengeCard", () => ({
  default: ({ challenge, loading, onComplete }: any) => (
    <div>
      <div>{challenge.title}</div>

      <div data-testid="challenge-loading">{String(loading)}</div>

      <button onClick={onComplete}>Complete Challenge</button>
    </div>
  ),
}));

describe("ChallengesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getUserKey).mockReturnValue("user-123");
  });

  const mockData = () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          challengeId: 1,
          title: "Daily Challenge",
        },
      })
      .mockResolvedValueOnce({
        data: {
          daily: [
            {
              challengeId: 11,
              title: "Bike to work",
              description: "Use bike",
              category: "transport",
              points: 50,
              carbonSaved: 2,
            },
            {
              challengeId: 12,
              title: "Eat vegetarian",
              description: "No meat",
              category: "food",
              points: 20,
              carbonSaved: 1,
            },
            {
              challengeId: 13,
              title: "Turn off lights",
              description: "Save power",
              category: "energy",
              points: 10,
              carbonSaved: 1,
            },
            {
              challengeId: 14,
              title: "Plant tree",
              description: "Go green",
              category: "lifestyle",
              points: 30,
              carbonSaved: 5,
            },
            {
              challengeId: 15,
              title: "Other",
              description: "Other mission",
              category: "unknown",
              points: 5,
              carbonSaved: 1,
            },
          ],
          weekly: [
            {
              challengeId: 21,
              title: "Weekly Mission",
              description: "Weekly desc",
              points: 100,
            },
          ],
          monthly: [
            {
              challengeId: 31,
              title: "Monthly Mission",
              description: "Monthly desc",
              points: 200,
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: [
          {
            title: "Completed One",
            points: 25,
          },
          {
            title: "Completed Zero",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: {
          greenPoints: 999,
          currentStreak: 7,
          level: "Eco Hero",
          achievements: [
            "Achievement 1",
            "Achievement 2",
            "Achievement 3",
            "Achievement 4",
          ],
        },
      });
  };

  it("shows loader initially", () => {
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}) as any);

    render(<ChallengesPage />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders all data correctly", async () => {
    mockData();

    render(<ChallengesPage />);

    expect(await screen.findByText("Daily Challenge")).toBeInTheDocument();

    expect(screen.getByText("999")).toBeInTheDocument();

    expect(screen.getByText("7")).toBeInTheDocument();

    expect(screen.getByText("Eco Hero")).toBeInTheDocument();

    expect(screen.getByText("Bike to work")).toBeInTheDocument();

    expect(screen.getByText("Eat vegetarian")).toBeInTheDocument();

    expect(screen.getByText("Turn off lights")).toBeInTheDocument();

    expect(screen.getByText("Plant tree")).toBeInTheDocument();

    expect(screen.getByText("Other")).toBeInTheDocument();

    expect(screen.getByText("🚲")).toBeInTheDocument();

    expect(screen.getByText("🥗")).toBeInTheDocument();

    expect(screen.getByText("⚡")).toBeInTheDocument();

    expect(screen.getByText("🌿")).toBeInTheDocument();

    expect(screen.getByText("🌱")).toBeInTheDocument();

    expect(screen.getByText("Weekly Mission")).toBeInTheDocument();

    expect(screen.getByText("Monthly Mission")).toBeInTheDocument();

    expect(screen.getByText(/Recent Achievements/i)).toBeInTheDocument();

    expect(screen.queryByText(/Achievement 4/i)).not.toBeInTheDocument();

    expect(screen.getByText(/Completed One/i)).toBeInTheDocument();

    const scoreElements = screen.getAllByText(/^\+\d+$/);

    expect(scoreElements).toHaveLength(2);
    expect(scoreElements[0]).toHaveTextContent("+25");
    expect(scoreElements[1]).toHaveTextContent("+0");
  });

  it("completes challenge successfully", async () => {
    mockData();

    vi.mocked(api.post).mockResolvedValue({});

    render(<ChallengesPage />);

    await screen.findByText("Daily Challenge");

    fireEvent.click(screen.getByText("Complete Challenge"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/challenges/complete?userKey=user-123",
        {
          challengeId: 1,
        },
      );
    });

    expect(toast.success).toHaveBeenCalledWith("Challenge Completed!");
  });

  it("handles complete challenge failure", async () => {
    mockData();

    vi.mocked(api.post).mockRejectedValue(new Error("failed"));

    render(<ChallengesPage />);

    await screen.findByText("Daily Challenge");

    fireEvent.click(screen.getByText("Complete Challenge"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to complete challenge");
    });
  });

  it("handles loadData failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(api.get).mockRejectedValue(new Error("load failed"));

    render(<ChallengesPage />);

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });
  it("does not render achievements section when there are no achievements", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          challengeId: 1,
          title: "Daily Challenge",
        },
      })
      .mockResolvedValueOnce({
        data: {
          daily: [],
          weekly: [],
          monthly: [],
        },
      })
      .mockResolvedValueOnce({
        data: [],
      })
      .mockResolvedValueOnce({
        data: {
          greenPoints: 100,
          currentStreak: 1,
          level: "Beginner",
          achievements: [],
        },
      });

    render(<ChallengesPage />);

    await screen.findByText("Daily Challenge");

    expect(screen.queryByText(/Recent Achievements/i)).not.toBeInTheDocument();
  });

  it("uses empty history when history api returns null", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          challengeId: 1,
          title: "Daily Challenge",
        },
      })
      .mockResolvedValueOnce({
        data: {
          daily: [],
          weekly: [],
          monthly: [],
        },
      })
      .mockResolvedValueOnce({
        data: null,
      })
      .mockResolvedValueOnce({
        data: {
          greenPoints: 10,
          currentStreak: 1,
          level: "Beginner",
          achievements: [],
        },
      });

    render(<ChallengesPage />);

    await screen.findByText("Daily Challenge");

    expect(screen.getByText("Challenge History")).toBeInTheDocument();

    expect(screen.queryByText(/Completed/i)).not.toBeInTheDocument();
  });

  it("uses daily and missions fallbacks when responses are undefined", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: undefined }) // daily
      .mockResolvedValueOnce({ data: undefined }) // missions
      .mockResolvedValueOnce({ data: [] }) // history
      .mockResolvedValueOnce({
        data: {
          greenPoints: 10,
          currentStreak: 1,
          level: "Beginner",
          achievements: [],
        },
      });

    render(<ChallengesPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });
  });
  it("uses empty gamification when gamification api returns null", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          challengeId: 1,
          title: "Daily Challenge",
        },
      })
      .mockResolvedValueOnce({
        data: {
          daily: [],
          weekly: [],
          monthly: [],
        },
      })
      .mockResolvedValueOnce({
        data: [],
      })
      .mockResolvedValueOnce({
        data: null,
      });

    render(<ChallengesPage />);

    await screen.findByText("Daily Challenge");

    expect(screen.queryByText(/Recent Achievements/i)).not.toBeInTheDocument();
  });
});
