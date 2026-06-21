import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScenarioForm from "@/components/forms/ScenarioForm";

describe("ScenarioForm", () => {
  it("renders all form fields", () => {
    render(<ScenarioForm onSubmit={vi.fn()} loading={false} />);

    expect(
      screen.getByRole("heading", {
        name: /scenario inputs/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/reduce car travel/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/reduce ac usage/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/reduce deliveries/i)).toBeInTheDocument();

    expect(
      screen.getByLabelText(/switch to vegetarian diet/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /run simulation/i,
      }),
    ).toBeInTheDocument();
  });

  it("submits entered values", async () => {
    const user = userEvent.setup();

    const onSubmit = vi.fn();

    render(<ScenarioForm onSubmit={onSubmit} loading={false} />);

    const inputs = screen.getAllByRole("spinbutton");

    await user.type(inputs[0], "25");

    await user.type(inputs[1], "3");

    await user.type(inputs[2], "8");

    await user.click(screen.getByLabelText(/switch to vegetarian diet/i));

    await user.click(
      screen.getByRole("button", {
        name: /run simulation/i,
      }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      carKmReduction: 25,
      acHoursReduction: 3,
      switchToVegetarian: true,
      deliveryReduction: 8,
    });
  });

  it("submits zeros when fields are empty", async () => {
    const user = userEvent.setup();

    const onSubmit = vi.fn();

    render(<ScenarioForm onSubmit={onSubmit} loading={false} />);

    await user.click(
      screen.getByRole("button", {
        name: /run simulation/i,
      }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      carKmReduction: 0,
      acHoursReduction: 0,
      switchToVegetarian: false,
      deliveryReduction: 0,
    });
  });

  it("shows loading state", () => {
    render(<ScenarioForm onSubmit={vi.fn()} loading />);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();

    expect(screen.getByText("Running...")).toBeInTheDocument();
  });
});
