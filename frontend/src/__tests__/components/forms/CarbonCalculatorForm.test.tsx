import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CarbonCalculatorForm from "@/components/forms/CarbonCalculatorForm";

describe("CarbonCalculatorForm", () => {
  it("renders all calculator sections", () => {
    const mockSubmit = vi.fn();
    render(<CarbonCalculatorForm onSubmit={mockSubmit} loading={false} />);

    expect(screen.getByText(/Car KM Per Week/i)).toBeInTheDocument();
    expect(screen.getByText(/Bike KM Per Week/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Public Transport KM Per Week/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Flights Per Year/i)).toBeInTheDocument();
    expect(screen.getByText(/Electricity Usage/i)).toBeInTheDocument();
    expect(screen.getByText(/AC Hours Per Day/i)).toBeInTheDocument();
    expect(screen.getByText(/Diet Type/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Online Deliveries Per Month/i),
    ).toBeInTheDocument();
  });

  it("renders all inputs and selects", () => {
    const mockSubmit = vi.fn();
    render(<CarbonCalculatorForm onSubmit={mockSubmit} loading={false} />);

    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs.length).toBeGreaterThanOrEqual(7);

    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it("allows changing values", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CarbonCalculatorForm onSubmit={mockSubmit} loading={false} />);

    const carInput = screen.getByLabelText(
      /Car KM Per Week/i,
    ) as HTMLInputElement;
    const bikeInput = screen.getByLabelText(
      /Bike KM Per Week/i,
    ) as HTMLInputElement;
    const flightsInput = screen.getByLabelText(
      /Flights Per Year/i,
    ) as HTMLInputElement;

    await user.type(carInput, "10");
    await user.type(bikeInput, "5");
    await user.type(flightsInput, "2");

    expect(Number(carInput.value)).toBe(10);
    expect(Number(bikeInput.value)).toBe(5);
    expect(Number(flightsInput.value)).toBe(2);
  });

  it("validates required inputs", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CarbonCalculatorForm onSubmit={mockSubmit} loading={false} />);

    const submitButton = screen.getByRole("button", { name: /Calculate/i });

    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalled();
  });

  it("submits valid carbon calculation data", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CarbonCalculatorForm onSubmit={mockSubmit} loading={false} />);

    const carInput = screen.getByLabelText(/Car KM Per Week/i);
    const electricityInput = screen.getByLabelText(/Electricity Usage/i);
    const submitButton = screen.getByRole("button", { name: /Calculate/i });

    await user.type(carInput, "15");
    await user.type(electricityInput, "500");
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalled();
  });

  it("verifies callback receives expected payload", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CarbonCalculatorForm onSubmit={mockSubmit} loading={false} />);

    const carInput = screen.getByLabelText(/Car KM Per Week/i);
    const bikeInput = screen.getByLabelText(/Bike KM Per Week/i);
    const publicTransportInput = screen.getByLabelText(
      /Public Transport KM Per Week/i,
    );
    const flightsInput = screen.getByLabelText(/Flights Per Year/i);
    const electricityInput = screen.getByLabelText(/Electricity Usage/i);
    const acInput = screen.getByLabelText(/AC Hours Per Day/i);
    const dietSelect = screen.getByDisplayValue("Mixed");
    const deliveriesInput = screen.getByLabelText(
      /Online Deliveries Per Month/i,
    );
    const submitButton = screen.getByRole("button", { name: /Calculate/i });

    await user.type(carInput, "20");
    await user.type(bikeInput, "10");
    await user.type(publicTransportInput, "5");
    await user.type(flightsInput, "3");
    await user.type(electricityInput, "600");
    await user.type(acInput, "4");
    await user.selectOptions(dietSelect, "Vegetarian");
    await user.type(deliveriesInput, "8");
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        carKmPerWeek: 20,
        bikeKmPerWeek: 10,
        publicTransportKmPerWeek: 5,
        flightsPerYear: 3,
        electricityKwh: 600,
        acHoursPerDay: 4,
        dietType: "Vegetarian",
        onlineDeliveriesPerMonth: 8,
      }),
    );
  });

  it("tests one realistic happy-path submission", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CarbonCalculatorForm onSubmit={mockSubmit} loading={false} />);

    const carInput = screen.getByLabelText(/Car KM Per Week/i);
    const electricityInput = screen.getByLabelText(/Electricity Usage/i);
    const dietSelect = screen.getByDisplayValue("Mixed");
    const submitButton = screen.getByRole("button", { name: /Calculate/i });

    await user.type(carInput, "25");
    await user.type(electricityInput, "750");
    await user.selectOptions(dietSelect, "Non Vegetarian");
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledOnce();
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        carKmPerWeek: 25,
        electricityKwh: 750,
        dietType: "NonVegetarian",
      }),
    );
  });
});
