import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import GoalsPage from "../../pages/Goals/GoalsPage";

import api from "../../api/api";
import { getUserKey } from "../../services/localStorage";
import toast from "react-hot-toast";

vi.mock("../../components/layout/DashboardLayout", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/layout/PageContainer", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/forms/GoalForm", () => ({
  default: ({ onSubmit, loading }: any) => (
    <div>
      <button onClick={() => onSubmit("Improve Carbon Score", 80)}>
        Create Goal
      </button>

      {loading && <span>Creating...</span>}
    </div>
  ),
}));

vi.mock("../../components/cards/GoalCard", () => ({
  default: ({ goal, onDelete, isDeleting }: any) => (
    <div data-testid="goal-card">
      <span>{goal.goalType}</span>

      <button onClick={() => onDelete(goal.id)}>Delete</button>

      {isDeleting && <span>Deleting...</span>}
    </div>
  ),
}));

vi.mock("../../api/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
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

describe("GoalsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getUserKey).mockReturnValue("user-1");

    vi.mocked(api.get).mockResolvedValue({
      data: [],
    });

    vi.mocked(api.post).mockResolvedValue({});

    vi.mocked(api.put).mockResolvedValue({});

    vi.mocked(api.delete).mockResolvedValue({});
  });

  it("shows loading state", () => {
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}));

    render(<GoalsPage />);

    expect(screen.getByText("Loading goals...")).toBeInTheDocument();
  });

  it("returns when userKey is missing", async () => {
    vi.mocked(getUserKey).mockReturnValue(null as any);

    render(<GoalsPage />);

    expect(await screen.findByText("No goals yet")).toBeInTheDocument();
  });

  it("handles load failure", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("failed"));

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<GoalsPage />);

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith("Unable to load goals");
    });
  });

  it("renders empty state", async () => {
    render(<GoalsPage />);

    expect(await screen.findByText("No goals yet")).toBeInTheDocument();

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("loads goals without history", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Improve Carbon Score",
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [],
      });

    render(<GoalsPage />);

    expect(await screen.findByText("Improve Carbon Score")).toBeInTheDocument();
  });

  it("updates improve carbon score goal", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Improve Carbon Score",
            targetValue: 50,
            currentValue: 0,
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 100,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/goals/1", {
        currentValue: 90,
        status: "Completed",
      });
    });
  });

  it("updates emission goal", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 2,
            goalType: "Reduce Total Emissions",
            targetValue: 100,
            currentValue: 300,
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 10,
            totalEmission: 80,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    });
  });

  it("covers default switch branch", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Other",
            currentValue: 10,
            status: "Completed",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 50,
            totalEmission: 50,
          },
        ],
      });

    render(<GoalsPage />);

    expect(await screen.findByText("Other")).toBeInTheDocument();

    expect(api.put).not.toHaveBeenCalled();
  });

  it("handles api.put failure", async () => {
    vi.mocked(api.put).mockRejectedValue(new Error("failed"));

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Improve Carbon Score",
            targetValue: 50,
            currentValue: 0,
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 10,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it("creates goal successfully", async () => {
    render(<GoalsPage />);

    await screen.findByText("No goals yet");

    await userEvent.click(screen.getByText("Create Goal"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();

      expect(toast.success).toHaveBeenCalledWith("Goal created successfully");
    });
  });

  it("handles missing user during create", async () => {
    vi.mocked(getUserKey).mockReturnValue(null as any);

    render(<GoalsPage />);

    await screen.findByText("No goals yet");

    await userEvent.click(screen.getByText("Create Goal"));

    expect(toast.error).toHaveBeenCalledWith("User not found");
  });

  it("handles create failure", async () => {
    vi.mocked(api.post).mockRejectedValue(new Error("failed"));

    render(<GoalsPage />);

    await screen.findByText("No goals yet");

    await userEvent.click(screen.getByText("Create Goal"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Unable to create goal");
    });
  });

  it("does not delete when cancelled", async () => {
    window.confirm = vi.fn(() => false);

    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Goal",
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [],
      });

    render(<GoalsPage />);

    await userEvent.click(await screen.findByText("Delete"));

    expect(api.delete).not.toHaveBeenCalled();
  });

  it("deletes goal successfully", async () => {
    window.confirm = vi.fn(() => true);

    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Goal",
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [],
      });

    render(<GoalsPage />);

    await userEvent.click(await screen.findByText("Delete"));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/api/goals/1");

      expect(toast.success).toHaveBeenCalledWith("Goal deleted successfully");
    });
  });

  it("handles delete failure", async () => {
    window.confirm = vi.fn(() => true);

    vi.mocked(api.delete).mockRejectedValue(new Error("failed"));

    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Goal",
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [],
      });

    render(<GoalsPage />);

    await userEvent.click(await screen.findByText("Delete"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Unable to delete goal");
    });
  });

  it("handles undefined history response", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Goal",
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: undefined,
      });

    render(<GoalsPage />);

    expect(await screen.findByText("Goal")).toBeInTheDocument();
  });

  it("does not update goal when values have not changed", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Improve Carbon Score",
            targetValue: 50,
            currentValue: 90,
            status: "Completed",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 100,
          },
        ],
      });

    render(<GoalsPage />);

    expect(await screen.findByText("Improve Carbon Score")).toBeInTheDocument();

    expect(api.put).not.toHaveBeenCalled();
  });

  it("handles undefined goals response", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: undefined,
      })
      .mockResolvedValueOnce({
        data: [],
      });

    render(<GoalsPage />);

    expect(await screen.findByText("No goals yet")).toBeInTheDocument();
  });

  it("does not call api.put when goal is already up to date", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Improve Carbon Score",
            targetValue: 80,
            currentValue: 90,
            status: "Completed",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 200,
          },
        ],
      });

    render(<GoalsPage />);

    expect(await screen.findByText("Improve Carbon Score")).toBeInTheDocument();

    expect(api.put).not.toHaveBeenCalled();
  });

  it("updates goal when only status changes", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Improve Carbon Score",
            targetValue: 80,
            currentValue: 90,
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 200,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/goals/1", {
        currentValue: 90,
        status: "Completed",
      });
    });
  });

  it("updates goal when only status changes", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Improve Carbon Score",
            targetValue: 80,
            currentValue: 90,
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 100,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/goals/1", {
        currentValue: 90,
        status: "Completed",
      });
    });
  });

  it("updates goal when only current value changes", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Improve Carbon Score",
            targetValue: 50,
            currentValue: 10,
            status: "Completed",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 100,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/goals/1", {
        currentValue: 90,
        status: "Completed",
      });
    });
  });

  it("updates General Sustainability goal", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "General Sustainability",
            targetValue: 50,
            currentValue: 0,
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 100,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/goals/1", {
        currentValue: 90,
        status: "Completed",
      });
    });
  });

  it("keeps General Sustainability goal active", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "General Sustainability",
            targetValue: 100,
            currentValue: 0,
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 100,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/goals/1", {
        currentValue: 90,
        status: "Active",
      });
    });
  });
  it("updates only currentValue", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Improve Carbon Score",
            targetValue: 50,
            currentValue: 10,
            status: "Completed",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 100,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/goals/1", {
        currentValue: 90,
        status: "Completed",
      });
    });
  });

  it("updates only status", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Improve Carbon Score",
            targetValue: 80,
            currentValue: 90,
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 90,
            totalEmission: 100,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/goals/1", {
        currentValue: 90,
        status: "Completed",
      });
    });
  });

  it("keeps Reduce Total Emissions goal active when emissions exceed target", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Reduce Total Emissions",
            targetValue: 50,
            currentValue: 300,
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 70,
            totalEmission: 80,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/goals/1", {
        currentValue: 80,
        status: "Active",
      });
    });
  });

  it("completes Reduce Total Emissions goal when emissions are below target", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            goalType: "Reduce Total Emissions",
            targetValue: 100,
            currentValue: 300,
            status: "Active",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            carbonScore: 70,
            totalEmission: 80,
          },
        ],
      });

    render(<GoalsPage />);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/goals/1", {
        currentValue: 80,
        status: "Completed",
      });
    });
  });
});
