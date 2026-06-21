import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import GoalForm from "@/components/forms/GoalForm";

describe("GoalForm", () => {
  it("renders all fields with default values", () => {
    render(<GoalForm onSubmit={vi.fn()} loading={false} />);

    expect(screen.getByText(/create new goal/i)).toBeInTheDocument();
    expect(screen.getByText(/goal type/i)).toBeInTheDocument();
    expect(screen.getByText(/target goal value/i)).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    const input = screen.getByRole("spinbutton");
    const button = screen.getByRole("button", {
      name: /create goal/i,
    });

    expect(select).toHaveValue("Improve Carbon Score");
    expect(input).toHaveValue(null);
    expect(button).toBeEnabled();
  });

  it("changes goal type", async () => {
    const user = userEvent.setup();

    render(<GoalForm onSubmit={vi.fn()} loading={false} />);

    const select = screen.getByRole("combobox");

    await user.selectOptions(select, "Reduce Total Emissions");

    expect(select).toHaveValue("Reduce Total Emissions");
  });

  it("updates the target value input", async () => {
    const user = userEvent.setup();

    render(<GoalForm onSubmit={vi.fn()} loading={false} />);

    const input = screen.getByRole("spinbutton");

    await user.type(input, "25");

    expect(input).toHaveValue(25);
  });

  it("submits valid values and resets the input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<GoalForm onSubmit={onSubmit} loading={false} />);

    const select = screen.getByRole("combobox");
    const input = screen.getByRole("spinbutton");

    await user.selectOptions(select, "General Sustainability");
    await user.type(input, "50");

    await user.click(
      screen.getByRole("button", {
        name: /create goal/i,
      }),
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("General Sustainability", 50);

    // covers setTargetValue("")
    expect(input).toHaveValue(null);
  });

  it("does not submit when target value is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<GoalForm onSubmit={onSubmit} loading={false} />);

    await user.click(
      screen.getByRole("button", {
        name: /create goal/i,
      }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows loading state", () => {
    render(<GoalForm onSubmit={vi.fn()} loading />);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Creating...");
  });

  it("shows normal button text when not loading", () => {
    render(<GoalForm onSubmit={vi.fn()} loading={false} />);

    expect(
      screen.getByRole("button", {
        name: /create goal/i,
      }),
    ).toHaveTextContent("Create Goal");
  });

  it("returns early when target value is empty", () => {
    const onSubmit = vi.fn();

    render(<GoalForm onSubmit={onSubmit} loading={false} />);

    const form = screen
      .getByRole("button", {
        name: /create goal/i,
      })
      .closest("form");

    expect(form).toBeInTheDocument();

    fireEvent.submit(form!);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
