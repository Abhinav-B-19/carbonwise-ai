import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { waitFor } from "@testing-library/react";

describe("RegistrationForm", () => {
  it("renders all form fields", () => {
    const mockSubmit = vi.fn();

    render(<RegistrationForm onSubmit={mockSubmit} loading={false} />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Sustainability Goal/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    const mockSubmit = vi.fn();

    render(<RegistrationForm onSubmit={mockSubmit} loading={false} />);

    expect(
      screen.getByRole("button", {
        name: /Get Started/i,
      }),
    ).toBeInTheDocument();
  });

  it("allows typing into inputs", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(<RegistrationForm onSubmit={mockSubmit} loading={false} />);

    const nameInput = screen.getByLabelText(/Full Name/i);

    const emailInput = screen.getByLabelText(/Email Address/i);

    await user.type(nameInput, "John Doe");

    await user.type(emailInput, "john@example.com");

    expect(nameInput).toHaveValue("John Doe");

    expect(emailInput).toHaveValue("john@example.com");
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(<RegistrationForm onSubmit={mockSubmit} loading={false} />);

    const submitButton = screen.getByRole("button", {
      name: /Get Started/i,
    });

    await user.click(submitButton);

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form data", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(<RegistrationForm onSubmit={mockSubmit} loading={false} />);

    const nameInput = screen.getByLabelText(/Full Name/i);

    const emailInput = screen.getByLabelText(/Email Address/i);

    const goalSelect = screen.getByLabelText(/Sustainability Goal/i);

    const submitButton = screen.getByRole("button", {
      name: /Get Started/i,
    });

    await user.type(nameInput, "John Doe");

    await user.type(emailInput, "john@example.com");

    await user.selectOptions(goalSelect, "Reduce Home Emissions");

    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledTimes(1);

    expect(mockSubmit).toHaveBeenCalledWith(
      "John Doe",
      "john@example.com",
      "Reduce Home Emissions",
    );
  });

  it("displays validation messages", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(<RegistrationForm onSubmit={mockSubmit} loading={false} />);

    await user.type(screen.getByLabelText(/Full Name/i), "ab");

    await user.type(screen.getByLabelText(/Email Address/i), "invalid-email");

    await user.click(
      screen.getByRole("button", {
        name: /Get Started/i,
      }),
    );

    expect(mockSubmit).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 3 characters."),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Please enter a valid email address."),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Please select a sustainability goal."),
      ).toBeInTheDocument();
    });
  });
});
