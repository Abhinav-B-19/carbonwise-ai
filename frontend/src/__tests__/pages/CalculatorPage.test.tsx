import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import CalculatorPage from "../../pages/Calculator/CalculatorPage";

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
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/layout/PageContainer", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/cards/ResultCard", () => ({
  default: ({ title, value }: any) => (
    <div>
      {title}: {value}
    </div>
  ),
}));

vi.mock("../../components/forms/CarbonCalculatorForm", () => ({
  default: ({ onSubmit, loading }: any) => (
    <div>
      <button
        onClick={() =>
          onSubmit({
            test: true,
          })
        }
      >
        Submit
      </button>

      <div>
        Loading:
        {loading ? "true" : "false"}
      </div>
    </div>
  ),
}));

describe("CalculatorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders initially", () => {
    render(<CalculatorPage />);

    expect(screen.getAllByText("Carbon Calculator").length).toBeGreaterThan(0);

    expect(screen.getByText("Loading:false")).toBeInTheDocument();
  });

  it("shows error when user key is missing", async () => {
    vi.mocked(getUserKey).mockReturnValue(null);

    render(<CalculatorPage />);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "User not found. Please register again.",
      );
    });

    expect(api.post).not.toHaveBeenCalled();
  });

  it("calculates successfully", async () => {
    vi.mocked(getUserKey).mockReturnValue("user-key");

    vi.mocked(api.post).mockResolvedValue({
      data: {
        transportationEmission: 10,
        homeEmission: 20,
        foodEmission: 5,
        lifestyleEmission: 2,
        totalEmission: 37,
        carbonScore: 85,
      },
    } as any);

    render(<CalculatorPage />);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Carbon footprint calculated successfully!",
      );
    });

    expect(api.post).toHaveBeenCalledWith(
      "/api/carbon/calculate",
      {
        test: true,
      },
      {
        headers: {
          "X-User-Key": "user-key",
        },
      },
    );

    expect(window.scrollTo).toHaveBeenCalled();

    expect(screen.getByText("Excellent")).toBeInTheDocument();

    expect(screen.getByText(/Transportation: 10/)).toBeInTheDocument();

    expect(screen.getByText(/Home: 20/)).toBeInTheDocument();

    expect(screen.getByText(/largest contributor is/i)).toBeInTheDocument();

    expect(screen.getByText(/Reduce AC usage/)).toBeInTheDocument();
  });

  it("handles api error with title", async () => {
    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.mocked(api.post).mockRejectedValue({
      response: {
        data: {
          title: "Bad request",
        },
      },
    });

    render(<CalculatorPage />);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Bad request");
    });
  });

  it("handles api error without title", async () => {
    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.mocked(api.post).mockRejectedValue({});

    render(<CalculatorPage />);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Calculation failed");
    });
  });

  it.each([
    [85, "Excellent"],
    [65, "Good"],
    [45, "Moderate"],
    [25, "High Impact"],
    [10, "Critical"],
  ])("renders score %i => %s", async (score, label) => {
    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.mocked(api.post).mockResolvedValue({
      data: {
        transportationEmission: 1,
        homeEmission: 1,
        foodEmission: 1,
        lifestyleEmission: 1,
        totalEmission: 4,
        carbonScore: score,
      },
    } as any);

    render(<CalculatorPage />);

    fireEvent.click(screen.getByText("Submit"));

    expect(await screen.findByText(label)).toBeInTheDocument();
  });

  it.each([
    [
      {
        transportationEmission: 50,
        homeEmission: 1,
        foodEmission: 1,
        lifestyleEmission: 1,
      },
      "Use public transport more often",
    ],
    [
      {
        transportationEmission: 1,
        homeEmission: 50,
        foodEmission: 1,
        lifestyleEmission: 1,
      },
      "Reduce AC usage by 1–2 hours/day",
    ],
    [
      {
        transportationEmission: 1,
        homeEmission: 1,
        foodEmission: 50,
        lifestyleEmission: 1,
      },
      "Increase plant-based meals",
    ],
    [
      {
        transportationEmission: 1,
        homeEmission: 1,
        foodEmission: 1,
        lifestyleEmission: 50,
      },
      "Reduce online deliveries",
    ],
  ])("renders recommendations", async (emissions: any, recommendation) => {
    vi.mocked(getUserKey).mockReturnValue("abc");

    vi.mocked(api.post).mockResolvedValue({
      data: {
        ...emissions,
        totalEmission: 100,
        carbonScore: 70,
      },
    } as any);

    render(<CalculatorPage />);

    fireEvent.click(screen.getByText("Submit"));

    expect(await screen.findByText(recommendation)).toBeInTheDocument();
  });
});
