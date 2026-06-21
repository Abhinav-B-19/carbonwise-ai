import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import ScenarioPage from "./../../pages/Scenario/ScenarioPage";

import api from "../../api/api";
import toast from "react-hot-toast";
import { getUserKey } from "../../services/localStorage";

vi.mock("../../api/api", () => ({
  default: {
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
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard">{children}</div>
  ),
}));

vi.mock("../../components/layout/PageContainer", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
}));

vi.mock("../../components/forms/ScenarioForm", () => ({
  default: ({ onSubmit, loading }: any) => (
    <div>
      <div data-testid="loading">{String(loading)}</div>

      <button
        onClick={() =>
          onSubmit({
            carKmReduction: 10,
            acHoursReduction: 2,
            deliveryReduction: 3,
            switchToVegetarian: true,
          })
        }
      >
        Submit Success
      </button>

      <button
        onClick={() =>
          onSubmit({
            carKmReduction: 5,
            acHoursReduction: 1,
            deliveryReduction: 2,
            switchToVegetarian: false,
          })
        }
      >
        Submit No Veg
      </button>
    </div>
  ),
}));

describe("ScenarioPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getUserKey).mockReturnValue("user-123");
  });

  it("renders initial state", () => {
    render(<ScenarioPage />);

    expect(screen.getByText(/No simulation yet/i)).toBeInTheDocument();

    expect(screen.getByText(/Run a scenario/i)).toBeInTheDocument();

    expect(screen.getByTestId("dashboard")).toBeInTheDocument();

    expect(screen.getByTestId("container")).toBeInTheDocument();
  });

  it("handles successful simulation and renders results", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        currentEmission: 100,
        projectedEmission: 70,
        reduction: 30,
        currentScore: 50,
        projectedScore: 80,
        aiExplanation: "**Great job**\n\n- Reduce AC usage",
      },
    } as any);

    render(<ScenarioPage />);

    fireEvent.click(screen.getByText("Submit Success"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/scenario/simulate?userKey=user-123",
        {
          carKmReduction: 10,
          acHoursReduction: 2,
          deliveryReduction: 3,
          switchToVegetarian: true,
        },
      );
    });

    expect(toast.success).toHaveBeenCalledWith("Simulation completed");

    expect(screen.getByText("100 kg CO₂e")).toBeInTheDocument();

    expect(screen.getByText("70 kg CO₂e")).toBeInTheDocument();

    expect(screen.getByText("30 kg CO₂e")).toBeInTheDocument();

    expect(screen.getByText("50")).toBeInTheDocument();

    expect(screen.getByText("80")).toBeInTheDocument();

    expect(screen.getByText("+30 Improvement")).toBeInTheDocument();

    expect(screen.getByText(/10 km\/week/i)).toBeInTheDocument();

    expect(screen.getByText(/2 hrs\/day/i)).toBeInTheDocument();

    expect(screen.getByText(/3 per month/i)).toBeInTheDocument();

    expect(screen.getByText(/Vegetarian Diet:\s*Yes/i)).toBeInTheDocument();

    expect(screen.getByText("Great job")).toBeInTheDocument();

    expect(screen.getByText("Reduce AC usage")).toBeInTheDocument();
  });

  it("does not show improvement badge when score does not increase", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        currentEmission: 100,
        projectedEmission: 95,
        reduction: 5,
        currentScore: 80,
        projectedScore: 80,
        aiExplanation: "No changes",
      },
    } as any);

    render(<ScenarioPage />);

    fireEvent.click(screen.getByText("Submit No Veg"));

    await waitFor(() => {
      expect(screen.getByText("No changes")).toBeInTheDocument();
    });

    expect(screen.queryByText(/\+.*Improvement/)).not.toBeInTheDocument();

    expect(screen.getByText(/Vegetarian Diet:\s*No/i)).toBeInTheDocument();
  });

  it("handles API failure", async () => {
    const error = new Error("Request failed");

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(api.post).mockRejectedValue(error);

    render(<ScenarioPage />);

    fireEvent.click(screen.getByText("Submit Success"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Simulation failed");
    });

    expect(consoleSpy).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });

  it("toggles loading state during submission", async () => {
    let resolvePromise: ((value: any) => void) | undefined;

    vi.mocked(api.post).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }) as any,
    );

    render(<ScenarioPage />);

    expect(screen.getByTestId("loading")).toHaveTextContent("false");

    fireEvent.click(screen.getByText("Submit Success"));

    expect(screen.getByTestId("loading")).toHaveTextContent("true");

    resolvePromise?.({
      data: {
        currentEmission: 1,
        projectedEmission: 1,
        reduction: 0,
        currentScore: 1,
        projectedScore: 1,
        aiExplanation: "Done",
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });
});
