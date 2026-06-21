import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it } from "vitest";

import ChallengeAchievements from "@/components/challenges/ChallengeAchievements";
import ChallengeHero from "@/components/challenges/ChallengeHero";
import ChallengeHistorySection from "@/components/challenges/ChallengeHistory";
import ChallengeStats from "@/components/challenges/ChallengeStats";
import MissionSection from "@/components/challenges/MissionSection";

describe("ChallengeAchievements", () => {
  it("returns null when achievements are empty", () => {
    const { container } = render(<ChallengeAchievements achievements={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders achievements", () => {
    render(
      <ChallengeAchievements
        achievements={["Achievement 1", "Achievement 2"]}
      />,
    );

    expect(screen.getByText(/Recent Achievements/i)).toBeInTheDocument();

    expect(screen.getByText(/Achievement 1/i)).toBeInTheDocument();

    expect(screen.getByText(/Achievement 2/i)).toBeInTheDocument();
  });
});

describe("ChallengeHero", () => {
  it("renders default values", () => {
    render(<ChallengeHero />);

    expect(
      screen.getByRole("heading", {
        name: "Sustainability Challenges",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Complete eco-friendly actions/i),
    ).toBeInTheDocument();
  });

  it("renders custom values", () => {
    render(
      <ChallengeHero title="My Challenges" description="Custom description" />,
    );

    expect(
      screen.getByRole("heading", {
        name: "My Challenges",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Custom description")).toBeInTheDocument();
  });
});

describe("ChallengeHistorySection", () => {
  it("returns null when history is empty", () => {
    const { container } = render(<ChallengeHistorySection history={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders completed item with date", () => {
    const date = "2025-01-01T00:00:00.000Z";

    render(
      <ChallengeHistorySection
        history={[
          {
            challengeId: 1,
            title: "Bike to Work",
            completed: true,
            completedAt: date,
          },
        ]}
      />,
    );

    expect(screen.getByText(/Challenge History/i)).toBeInTheDocument();

    expect(screen.getByText(/Bike to Work/i)).toBeInTheDocument();

    expect(screen.getByText(/Completed/i)).toBeInTheDocument();

    expect(
      screen.getByText(new Date(date).toLocaleDateString()),
    ).toBeInTheDocument();
  });

  it("renders pending item without date", () => {
    render(
      <ChallengeHistorySection
        history={[
          {
            challengeId: 2,
            title: "Plant Tree",
            completed: false,
          },
        ]}
      />,
    );

    expect(screen.getByText(/Plant Tree/i)).toBeInTheDocument();

    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
  });
});

describe("ChallengeStats", () => {
  it("returns null when gamification is undefined", () => {
    const { container } = render(<ChallengeStats />);

    expect(container.firstChild).toBeNull();
  });

  it("renders stats", () => {
    render(
      <ChallengeStats
        gamification={{
          greenPoints: 500,
          currentStreak: 12,
          level: "Eco Hero",
          achievements: [],
        }}
      />,
    );

    expect(screen.getByText(/Green Points/i)).toBeInTheDocument();

    expect(screen.getByText("500")).toBeInTheDocument();

    expect(screen.getByText("12")).toBeInTheDocument();

    expect(screen.getByText("Eco Hero")).toBeInTheDocument();
  });
});

describe("MissionSection", () => {
  afterEach(() => {
    cleanup();
  });

  const mission = {
    challengeId: 1,
    title: "Bike to Work",
    description: "Use your bicycle today",
    category: "transport",
    points: 50,
    carbonSaved: 2,
  };

  it("renders empty state", () => {
    render(
      <MissionSection title="Daily Missions" missions={[]} variant="green" />,
    );

    expect(screen.getByText(/Daily Missions/i)).toBeInTheDocument();

    expect(screen.getByText(/No missions available/i)).toBeInTheDocument();
  });

  it.each(["green", "orange", "purple"] as const)(
    "renders missions for %s variant",
    (variant) => {
      render(
        <MissionSection
          title="Missions"
          missions={[mission]}
          variant={variant}
        />,
      );

      expect(screen.getByText(/Bike to Work/i)).toBeInTheDocument();

      expect(screen.getByText(/Use your bicycle today/i)).toBeInTheDocument();

      expect(screen.getByText(/transport/i)).toBeInTheDocument();

      expect(screen.getByText(/🏆 50/i)).toBeInTheDocument();

      expect(screen.getByText(/🌍 2kg/i)).toBeInTheDocument();
    },
  );

  it("renders fallbacks", () => {
    render(
      <MissionSection
        title="Missions"
        missions={[
          {
            challengeId: 2,
            title: "Fallback Mission",
          } as any,
        ]}
        variant="green"
      />,
    );

    expect(screen.getByText(/Fallback Mission/i)).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === "Mission"),
    ).toBeInTheDocument();

    expect(screen.getByText(/🏆 0/i)).toBeInTheDocument();

    expect(screen.getByText(/🌍 0kg/i)).toBeInTheDocument();
  });
});
