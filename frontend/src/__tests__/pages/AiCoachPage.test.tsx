// AiCoachPage.test.tsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AiCoachPage from "../../pages/AiCoach/AiCoachPage";
import api from "../../api/api";
import { getUserKey } from "../../services/localStorage";
import toast from "react-hot-toast";

vi.mock("../../components/layout/DashboardLayout", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/layout/PageContainer", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/ui/PageLoader", () => ({
  default: () => <div data-testid="page-loader">Loading...</div>,
}));

vi.mock("react-markdown", () => ({
  default: ({ children, components }: any) => {
    components?.strong?.({
      children: "bold",
    });

    components?.p?.({
      children: "paragraph",
    });

    components?.li?.({
      children: "item",
    });

    return <div data-testid="markdown">{children}</div>;
  },
}));

vi.mock("../../api/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("../../services/localStorage", () => ({
  getUserKey: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("AiCoachPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getUserKey).mockReturnValue("user-1");

    vi.mocked(api.get).mockResolvedValue({
      data: [],
    });

    vi.mocked(api.post).mockResolvedValue({
      data: {
        insight: "Reduce energy usage",
        generatedAt: "2024-01-01T10:00:00Z",
      },
    });
  });

  it("shows loader initially", () => {
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}));

    render(<AiCoachPage />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();
  });

  it("loads empty history", async () => {
    render(<AiCoachPage />);

    expect(await screen.findByText(/Generate AI advice/)).toBeInTheDocument();

    expect(api.get).toHaveBeenCalledWith("/api/ai/history?userKey=user-1");
  });

  it("loads latest insight and history", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [
        {
          insight: "Latest insight",
          createdAt: "2024-01-01T10:00:00Z",
        },
        {
          insight: "Older insight",
          createdAt: "2023-12-01T10:00:00Z",
        },
      ],
    });

    render(<AiCoachPage />);

    expect(await screen.findByText("Latest insight")).toBeInTheDocument();

    expect(screen.getByText("Previous Insights")).toBeInTheDocument();

    expect(screen.getByText("Older insight")).toBeInTheDocument();
  });

  it("handles history load failure", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(api.get).mockRejectedValue(new Error("failed"));

    render(<AiCoachPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    expect(screen.getByText(/Generate AI advice/)).toBeInTheDocument();
  });

  it("generates new advice successfully", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [],
    });

    vi.mocked(api.post).mockResolvedValue({
      data: {
        insight: "AI generated advice",
        generatedAt: "2024-01-01T10:00:00Z",
      },
    });

    render(<AiCoachPage />);

    await screen.findByText(/Generate AI advice/);

    await userEvent.click(
      screen.getByRole("button", {
        name: /Generate New Insight/i,
      }),
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/ai/coach?userKey=user-1");
    });

    expect(toast.success).toHaveBeenCalledWith("AI advice generated");

    expect(screen.getByText("AI generated advice")).toBeInTheDocument();
  });

  it("shows generating state", async () => {
    let resolvePost: ((value: any) => void) | undefined;

    vi.mocked(api.post).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePost = resolve;
        }) as any,
    );

    render(<AiCoachPage />);

    await screen.findByText(/Generate AI advice/);

    const button = screen.getByRole("button", {
      name: /Generate New Insight/i,
    });

    await userEvent.click(button);

    expect(
      screen.getByRole("button", {
        name: /Generating/i,
      }),
    ).toBeDisabled();

    resolvePost?.({
      data: {
        insight: "Done",
        generatedAt: "2024-01-01T10:00:00Z",
      },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /Generate New Insight/i,
        }),
      ).toBeEnabled();
    });
  });

  it("handles generate advice failure", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(api.post).mockRejectedValue(new Error("failed"));

    render(<AiCoachPage />);

    await screen.findByText(/Generate AI advice/);

    await userEvent.click(
      screen.getByRole("button", {
        name: /Generate New Insight/i,
      }),
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith("Unable to generate advice");
    });
  });

  it("calls getUserKey for load and generate", async () => {
    render(<AiCoachPage />);

    await screen.findByText(/Generate AI advice/);

    await userEvent.click(
      screen.getByRole("button", {
        name: /Generate New Insight/i,
      }),
    );

    expect(getUserKey).toHaveBeenCalled();
  });

  it("renders markdown custom components", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [
        {
          insight: "**Latest**\n\n- Item",
          createdAt: "2024-01-01T10:00:00Z",
        },
        {
          insight: "**Previous**\n\n- Item",
          createdAt: "2023-12-01T10:00:00Z",
        },
      ],
    });

    render(<AiCoachPage />);

    expect(await screen.findByText(/\*\*Latest\*\*/)).toBeInTheDocument();

    expect(screen.getByText("Previous Insights")).toBeInTheDocument();

    expect(screen.getAllByTestId("markdown")).toHaveLength(2);
  });

  it("handles undefined history data", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: undefined,
    });

    render(<AiCoachPage />);

    expect(await screen.findByText(/Generate AI advice/)).toBeInTheDocument();
  });

  it("handles undefined generate response data", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [],
    });

    vi.mocked(api.post).mockResolvedValue({
      data: {},
    } as any);

    render(<AiCoachPage />);

    await screen.findByText(/Generate AI advice/i);

    await userEvent.click(
      screen.getByRole("button", {
        name: /Generate New Insight/i,
      }),
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("AI advice generated");
    });

    // insight falls back to ""
    expect(
      screen.getByText(
        /Generate AI advice to receive personalized sustainability insights/i,
      ),
    ).toBeInTheDocument();
  });

  it("handles completely undefined generate response", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [],
    });

    vi.mocked(api.post).mockResolvedValue(undefined as any);

    render(<AiCoachPage />);

    await screen.findByText(/Generate AI advice/i);

    await userEvent.click(
      screen.getByRole("button", {
        name: /Generate New Insight/i,
      }),
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("AI advice generated");
    });

    expect(
      screen.getByText(
        /Generate AI advice to receive personalized sustainability insights/i,
      ),
    ).toBeInTheDocument();
  });
});
