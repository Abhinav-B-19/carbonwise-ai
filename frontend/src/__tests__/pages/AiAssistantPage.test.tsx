// AiAssistantPage.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AiAssistantPage from "../../pages/AiAssistant/AiAssistantPage";

import chatService from "../../services/chatService";
import { getUserKey } from "../../services/localStorage";
import toast from "react-hot-toast";

vi.mock("../../components/layout/DashboardLayout", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/layout/PageContainer", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/chat/ConsentModal", () => ({
  default: ({ open, onAccept, onClose }: any) =>
    open ? (
      <div data-testid="consent-modal">
        <button onClick={onAccept}>Accept</button>

        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("react-markdown", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../services/chatService", () => ({
  default: {
    getHistory: vi.fn(),
    getUsage: vi.fn(),
    sendMessage: vi.fn(),
    clearHistory: vi.fn(),
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

describe("AiAssistantPage", () => {
  vi.mocked(chatService.sendMessage).mockResolvedValue({
    response: "Mock response",
    remainingMessages: 4,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => "true"),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    vi.mocked(getUserKey).mockReturnValue("user-1");

    vi.mocked(chatService.getHistory).mockResolvedValue([]);

    vi.mocked(chatService.getUsage).mockResolvedValue({
      used: 0,
      limit: 5,
      remaining: 5,
    });

    vi.mocked(chatService.sendMessage).mockResolvedValue({
      response: "Mock response",
      remainingMessages: 4,
    });

    vi.mocked(chatService.clearHistory).mockResolvedValue(undefined);
  });

  it("debug localStorage", () => {
    expect(localStorage.getItem("carbonwise_ai_consent")).toBe("true");
  });

  it("renders page and loads data", async () => {
    render(<AiAssistantPage />);

    await waitFor(() => {
      expect(chatService.getHistory).toHaveBeenCalledWith("user-1");

      expect(chatService.getUsage).toHaveBeenCalledWith("user-1");
    });

    expect(screen.getByText("AI Sustainability Assistant")).toBeInTheDocument();

    expect(screen.getByText(/Remaining:/)).toBeInTheDocument();
  });

  it("shows consent modal when consent not accepted", () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    render(<AiAssistantPage />);

    expect(screen.getByTestId("consent-modal")).toBeInTheDocument();
  });

  it("accepts consent", async () => {
    const setItem = vi.fn();

    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem,
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    render(<AiAssistantPage />);

    await userEvent.click(screen.getByText("Accept"));

    expect(setItem).toHaveBeenCalledWith("carbonwise_ai_consent", "true");
  });

  it("handles loadData failure", async () => {
    vi.mocked(chatService.getHistory).mockRejectedValue(new Error("failed"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<AiAssistantPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  it("renders suggestions", async () => {
    render(<AiAssistantPage />);

    expect(screen.getByText("Analyze my carbon score")).toBeInTheDocument();
  });

  it("clicking suggestion populates input", async () => {
    render(<AiAssistantPage />);

    await userEvent.click(screen.getByText("Analyze my carbon score"));

    expect(screen.getByPlaceholderText("Ask CarbonWise AI...")).toHaveValue(
      "Analyze my carbon score",
    );
  });

  it("does not send empty message", async () => {
    render(<AiAssistantPage />);

    await userEvent.click(screen.getByText("Send"));

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it("shows daily limit reached", async () => {
    vi.mocked(chatService.getUsage).mockResolvedValue({
      used: 5,
      limit: 5,
      remaining: 0,
    });

    render(<AiAssistantPage />);

    await screen.findByText(/Remaining:/);

    const input = screen.getByPlaceholderText("Ask CarbonWise AI...");

    await userEvent.type(input, "hello");

    await userEvent.click(
      screen.getByRole("button", {
        name: /send/i,
      }),
    );

    expect(toast.error).toHaveBeenCalledWith("Daily limit reached");

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it("returns when user key missing", async () => {
    (getUserKey as any).mockReturnValue(null);

    render(<AiAssistantPage />);

    const input = screen.getByPlaceholderText("Ask CarbonWise AI...");

    await userEvent.type(input, "hello");
    await userEvent.click(screen.getByText("Send"));

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it("sends message successfully", async () => {
    vi.mocked(chatService.sendMessage).mockResolvedValue({
      response: "AI reply",
      remainingMessages: 4,
    });

    vi.mocked(chatService.getHistory).mockResolvedValue([
      {
        role: "assistant",
        message: "AI reply",
        createdAt: new Date().toISOString(),
      },
    ]);

    render(<AiAssistantPage />);

    const input = screen.getByPlaceholderText("Ask CarbonWise AI...");

    await userEvent.type(input, "hello");

    await userEvent.click(
      screen.getByRole("button", {
        name: /send/i,
      }),
    );

    await waitFor(() => {
      expect(chatService.sendMessage).toHaveBeenCalledWith("user-1", "hello");
    });

    expect(await screen.findByText("AI reply")).toBeInTheDocument();
  });

  it("handles send message failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    (chatService.sendMessage as any).mockRejectedValue(new Error("failed"));

    render(<AiAssistantPage />);

    const input = screen.getByPlaceholderText("Ask CarbonWise AI...");

    await userEvent.type(input, "hello");
    await userEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Unable to send message");
    });
  });

  it("submits on Enter", async () => {
    (chatService.sendMessage as any).mockResolvedValue({
      response: "reply",
      remainingMessages: 4,
    });

    render(<AiAssistantPage />);

    const input = screen.getByPlaceholderText("Ask CarbonWise AI...");

    fireEvent.change(input, {
      target: { value: "hello" },
    });

    fireEvent.keyDown(input, {
      key: "Enter",
    });

    await waitFor(() => {
      expect(chatService.sendMessage).toHaveBeenCalled();
    });
  });

  it("does not clear history when cancelled", async () => {
    window.confirm = vi.fn(() => false);

    render(<AiAssistantPage />);

    await userEvent.click(screen.getByText("Clear Chat"));

    expect(chatService.clearHistory).not.toHaveBeenCalled();
  });

  it("clears history successfully", async () => {
    window.confirm = vi.fn(() => true);

    render(<AiAssistantPage />);

    await userEvent.click(screen.getByText("Clear Chat"));

    await waitFor(() => {
      expect(chatService.clearHistory).toHaveBeenCalledWith("user-1");
      expect(toast.success).toHaveBeenCalledWith("History cleared");
    });
  });

  it("handles clear history failure", async () => {
    window.confirm = vi.fn(() => true);

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    (chatService.clearHistory as any).mockRejectedValue(new Error("failed"));

    render(<AiAssistantPage />);

    await userEvent.click(screen.getByText("Clear Chat"));

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Unable to clear history");
    });
  });

  it("returns when clearing history and userKey is missing", async () => {
    window.confirm = vi.fn(() => true);

    vi.mocked(getUserKey).mockReturnValue(null);

    render(<AiAssistantPage />);

    await userEvent.click(screen.getByText("Clear Chat"));

    expect(chatService.clearHistory).not.toHaveBeenCalled();
  });

  it("closes consent modal", async () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    render(<AiAssistantPage />);

    expect(screen.getByTestId("consent-modal")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Close"));

    expect(screen.queryByTestId("consent-modal")).not.toBeInTheDocument();
  });
});
