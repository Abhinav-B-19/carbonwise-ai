import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import chatService from "@/services/chatService";
import { getUserKey } from "@/services/localStorage";

const mockNavigate = vi.fn();
const mockLocation = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation(),
  };
});

vi.mock("react-markdown", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/services/chatService", () => ({
  default: {
    getHistory: vi.fn(),
    getUsage: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

vi.mock("@/services/localStorage", () => ({
  getUserKey: vi.fn(),
}));

describe("FloatingChatWidget", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mockLocation.mockReturnValue({
      pathname: "/dashboard",
    });

    vi.mocked(getUserKey).mockReturnValue("user123");

    vi.mocked(chatService.getHistory).mockResolvedValue([]);

    vi.mocked(chatService.getUsage).mockResolvedValue({
      remaining: 25,
      used: 0,
      limit: 25,
    });

    Element.prototype.scrollIntoView = vi.fn();
  });

  it("returns null on ai assistant page", () => {
    mockLocation.mockReturnValue({
      pathname: "/ai-assistant",
    });

    const { container } = render(<FloatingChatWidget />);

    expect(container).toBeEmptyDOMElement();
  });

  it("opens widget and loads data", async () => {
    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(chatService.getHistory).toHaveBeenCalledWith("user123");

      expect(chatService.getUsage).toHaveBeenCalledWith("user123");
    });

    expect(screen.getByText(/sustainability assistant/i)).toBeInTheDocument();

    expect(screen.getByText("25/25")).toBeInTheDocument();
  });

  it("does not load data without user key", async () => {
    vi.mocked(getUserKey).mockReturnValue(null);

    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    expect(chatService.getHistory).not.toHaveBeenCalled();

    expect(chatService.getUsage).not.toHaveBeenCalled();
  });

  it("renders messages, suggestions and updates input", async () => {
    const scrollSpy = vi.fn();

    Element.prototype.scrollIntoView = scrollSpy;

    vi.mocked(chatService.getHistory).mockResolvedValue([
      {
        role: "user",
        message: "hello",
        createdAt: "1",
      },
      {
        role: "assistant",
        message: "hi",
        createdAt: "2",
      },
    ] as any);

    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    expect(await screen.findByText("hello")).toBeInTheDocument();

    expect(screen.getByText("hi")).toBeInTheDocument();

    expect(scrollSpy).toHaveBeenCalled();

    expect(screen.getByText("Analyze my carbon score")).toBeInTheDocument();

    expect(screen.getByText("How can I reduce emissions?")).toBeInTheDocument();

    expect(screen.getByText("Create sustainability plan")).toBeInTheDocument();

    expect(screen.getByText("What is renewable energy?")).toBeInTheDocument();

    await user.click(screen.getByText("How can I reduce emissions?"));

    const input = screen.getByPlaceholderText(/ask carbonwise ai/i);

    expect(input).toHaveValue("How can I reduce emissions?");
  });

  it("navigates to full assistant", async () => {
    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    await user.click(
      await screen.findByRole("button", {
        name: /open full assistant/i,
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/ai-assistant");
  });

  it("does not send empty message", async () => {
    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    const buttons = screen.getAllByRole("button");

    const sendButton = buttons[buttons.length - 1];

    await user.click(sendButton);

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it("does not send when usage limit is reached", async () => {
    vi.mocked(chatService.getUsage).mockResolvedValue({
      remaining: 0,
      used: 25,
      limit: 25,
    });

    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    const input = await screen.findByPlaceholderText(/ask carbonwise ai/i);

    await user.type(input, "hello");

    await user.keyboard("{Enter}");

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it("does not send when user key is missing", async () => {
    vi.mocked(getUserKey).mockReturnValue(null);

    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    const input = await screen.findByPlaceholderText(/ask carbonwise ai/i);

    await user.type(input, "hello");

    await user.keyboard("{Enter}");

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it("sends message with enter key, shows loading state and recovers", async () => {
    let resolve!: (value: any) => void;

    vi.mocked(chatService.sendMessage).mockImplementation(
      () =>
        new Promise((r) => {
          resolve = r;
        }) as any,
    );

    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    const input = await screen.findByPlaceholderText(/ask carbonwise ai/i);

    await user.type(input, "hello");

    await user.keyboard("{Enter}");

    expect(await screen.findByText(/thinking/i)).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");

    const sendButton = buttons[buttons.length - 1];

    expect(sendButton).toBeDisabled();

    resolve({
      response: "done",
    });

    await waitFor(() => {
      expect(chatService.sendMessage).toHaveBeenCalledWith("user123", "hello");

      expect(screen.queryByText(/thinking/i)).not.toBeInTheDocument();

      expect(sendButton).not.toBeDisabled();
    });
  });

  it("handles send errors", async () => {
    vi.spyOn(console, "error").mockImplementation(vi.fn());

    vi.mocked(chatService.sendMessage).mockRejectedValue(new Error("failed"));

    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    const input = await screen.findByPlaceholderText(/ask carbonwise ai/i);

    await user.type(input, "hello");

    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it("closes when clicking outside", async () => {
    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(/sustainability assistant/i)).toBeInTheDocument();

    await user.click(document.body);

    await waitFor(() => {
      expect(
        screen.queryByText(/sustainability assistant/i),
      ).not.toBeInTheDocument();
    });
  });

  it("handles loadData errors", async () => {
    vi.spyOn(console, "error").mockImplementation(vi.fn());

    vi.mocked(chatService.getHistory).mockRejectedValue(new Error("boom"));

    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it("closes widget from backdrop click", async () => {
    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(/sustainability assistant/i)).toBeInTheDocument();

    const backdrop = screen.getByTestId("chat-backdrop");

    await user.click(backdrop);

    await waitFor(() => {
      expect(
        screen.queryByText(/sustainability assistant/i),
      ).not.toBeInTheDocument();
    });
  });

  it("renders widget header when opened", async () => {
    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("CarbonWise AI")).toBeInTheDocument();

    expect(screen.getByText("Sustainability Assistant")).toBeInTheDocument();
  });

  it("closes widget from close button", async () => {
    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(/sustainability assistant/i)).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");

    // First button after opening is usually the X button
    const closeButton = buttons[0];

    await user.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/sustainability assistant/i),
      ).not.toBeInTheDocument();
    });
  });

  it("closes widget from backdrop click", async () => {
    const user = userEvent.setup();

    render(<FloatingChatWidget />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(/sustainability assistant/i)).toBeInTheDocument();

    const backdrop = screen.getByTestId("chat-backdrop");

    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(
        screen.queryByText(/sustainability assistant/i),
      ).not.toBeInTheDocument();
    });
  });
});
