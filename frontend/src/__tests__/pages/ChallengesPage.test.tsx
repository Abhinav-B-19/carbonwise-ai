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

  it("returns early when user key is missing", async () => {
    vi.mocked(getUserKey).mockReturnValue(null as any);

    render(<ChallengesPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    expect(api.get).not.toHaveBeenCalled();
  });

  it("does nothing when completeChallenge is called without daily challenge", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: null })
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

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Complete Challenge")).not.toBeInTheDocument();
  });
});
