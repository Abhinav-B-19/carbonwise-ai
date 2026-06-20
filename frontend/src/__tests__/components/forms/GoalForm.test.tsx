import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateGoalForm from "@/components/forms/GoalForm";

describe("GoalForm", () => {
  it("renders all fields", () => {
    const mockSubmit = vi.fn();
    render(<CreateGoalForm onSubmit={mockSubmit} loading={false} />);

    expect(screen.getByText(/Goal Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Goal Value/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Goal/i }),
    ).toBeInTheDocument();
  });

  it("allows user input", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CreateGoalForm onSubmit={mockSubmit} loading={false} />);

    const targetInput = screen.getByPlaceholderText(/Example: 20/i);

    await user.type(targetInput, "25");

    expect(targetInput).toHaveValue(25);
  });

  it("validates required inputs", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CreateGoalForm onSubmit={mockSubmit} loading={false} />);

    const submitButton = screen.getByRole("button", { name: /Create Goal/i });

    await user.click(submitButton);

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("submits valid goal values", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CreateGoalForm onSubmit={mockSubmit} loading={false} />);

    const targetInput = screen.getByPlaceholderText(/Example: 20/i);
    const submitButton = screen.getByRole("button", { name: /Create Goal/i });

    await user.type(targetInput, "30");
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith("Improve Carbon Score", 30);
  });

  it("handles numeric input correctly", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CreateGoalForm onSubmit={mockSubmit} loading={false} />);

    const targetInput = screen.getByPlaceholderText(
      /Example: 20/i,
    ) as HTMLInputElement;

    await user.type(targetInput, "42");

    expect(Number(targetInput.value)).toBe(42);
  });

  it("verifies callback invocation", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CreateGoalForm onSubmit={mockSubmit} loading={false} />);

    const goalSelect = screen.getByDisplayValue("Improve Carbon Score");
    const targetInput = screen.getByPlaceholderText(/Example: 20/i);
    const submitButton = screen.getByRole("button", { name: /Create Goal/i });

    await user.selectOptions(goalSelect, "Reduce Total Emissions");
    await user.type(targetInput, "50");
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledOnce();
    expect(mockSubmit).toHaveBeenCalledWith("Reduce Total Emissions", 50);
  });
});
