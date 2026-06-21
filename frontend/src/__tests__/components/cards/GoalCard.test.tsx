import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GoalCard from "@/components/cards/GoalCard";

describe("GoalCard", () => {
  const goal = {
    id: 1,
    goalType: "Reduce Carbon Emissions",
    targetValue: 100,
    currentValue: 50,
    status: "Active",
    createdAt: "2026-06-20T00:00:00Z",
  };

  it("renders goal information", () => {
    render(<GoalCard goal={goal} onDelete={vi.fn()} />);

    expect(screen.getByText(/Reduce Carbon Emissions/i)).toBeInTheDocument();

    expect(screen.getByText("100")).toBeInTheDocument();

    expect(screen.getByText("50")).toBeInTheDocument();

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("calculates normal goal progress", () => {
    render(
      <GoalCard
        goal={{
          ...goal,
          goalType: "Increase Green Score",
        }}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("calculates reduction goal progress", () => {
    render(
      <GoalCard
        goal={{
          ...goal,
          currentValue: 200,
        }}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("shows completed progress", () => {
    render(
      <GoalCard
        goal={{
          ...goal,
          status: "Completed",
          currentValue: 90,
        }}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("calls onDelete", async () => {
    const user = userEvent.setup();

    const onDelete = vi.fn();

    render(<GoalCard goal={goal} onDelete={onDelete} />);

    await user.click(
      screen.getByRole("button", {
        name: /delete goal/i,
      }),
    );

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("shows deleting state", () => {
    render(<GoalCard goal={goal} onDelete={vi.fn()} isDeleting />);

    expect(screen.getByRole("button")).toBeDisabled();

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });

  it("handles zero target value", () => {
    render(
      <GoalCard
        goal={{
          ...goal,
          targetValue: 0,
        }}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders default status color branch", () => {
    render(
      <GoalCard
        goal={{
          ...goal,
          status: "Paused",
        }}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Paused")).toBeInTheDocument();
  });

  it("shows 100 percent when normal goal target is achieved", () => {
    render(
      <GoalCard
        goal={{
          ...goal,
          goalType: "Increase Green Score",
          currentValue: 150,
        }}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("renders N/A when createdAt is not provided", () => {
    render(
      <GoalCard
        goal={{
          ...goal,
          createdAt: undefined,
        }}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
