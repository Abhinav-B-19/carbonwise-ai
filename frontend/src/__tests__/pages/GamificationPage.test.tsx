import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import GamificationPage from "../../pages/Gamification/GamificationPage";
import api from "../../api/api";

vi.mock("../../api/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("../../services/localStorage", () => ({
  getUserKey: () => "user-123",
}));

vi.mock("../../components/layout/DashboardLayout", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/layout/PageContainer", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/ui/PageLoader", () => ({
  default: () => <div>Loading...</div>,
}));

const mockedApi = vi.mocked(api);

describe("GamificationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loader initially", () => {
    mockedApi.get.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <GamificationPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders gamification data", async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        greenPoints: 250,
        currentStreak: 12,
        level: "Eco Champion",
        achievements: ["First Challenge", "7 Day Streak"],
      },
    });

    render(
      <MemoryRouter>
        <GamificationPage />
      </MemoryRouter>,
    );

    expect(mockedApi.get).toHaveBeenCalledWith(
      "/api/gamification?userKey=user-123",
    );

    expect(await screen.findByText("250")).toBeInTheDocument();

    expect(screen.getByText("12")).toBeInTheDocument();

    expect(screen.getByText("🏆 Eco Champion")).toBeInTheDocument();

    expect(screen.getByText("First Challenge")).toBeInTheDocument();

    expect(screen.getByText("7 Day Streak")).toBeInTheDocument();

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders green advocate level", async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        greenPoints: 10,
        currentStreak: 1,
        level: "Green Advocate",
        achievements: [],
      },
    });

    render(
      <MemoryRouter>
        <GamificationPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("🌿 Green Advocate")).toBeInTheDocument();
  });

  it("renders default level", async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        greenPoints: 10,
        currentStreak: 1,
        level: "Eco Beginner",
        achievements: [],
      },
    });

    render(
      <MemoryRouter>
        <GamificationPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("🌱 Eco Beginner")).toBeInTheDocument();
  });

  it("renders empty achievements state", async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        greenPoints: 10,
        currentStreak: 1,
        level: "Eco Beginner",
        achievements: [],
      },
    });

    render(
      <MemoryRouter>
        <GamificationPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/complete challenges/i)).toBeInTheDocument();
  });

  it("handles api failure", async () => {
    const spy = vi.spyOn(console, "error");

    spy.mockImplementation(() => {});

    mockedApi.get.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <GamificationPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });

  it("handles undefined achievements", async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        greenPoints: 10,
        currentStreak: 2,
        level: "Eco Beginner",
      },
    });

    render(
      <MemoryRouter>
        <GamificationPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("🌱 Eco Beginner")).toBeInTheDocument();

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
