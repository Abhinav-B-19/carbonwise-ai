import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import RegisterPage from "../../pages/Register/RegisterPage";
import api from "../../api/api";
import { saveUserKey } from "../../services/localStorage";
import userEvent from "@testing-library/user-event";

const mockNavigate = vi.fn();

vi.mock("../../api/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("../../services/localStorage", () => ({
  saveUserKey: vi.fn(),
}));

vi.mock("../../components/forms/RegistrationForm", () => ({
  default: ({ onSubmit, loading }: any) => (
    <div>
      <div>
        Loading:
        {String(loading)}
      </div>

      <button
        onClick={() =>
          onSubmit("Abhinav", "abhinav@test.com", "Reduce Emissions")
        }
      >
        Submit Form
      </button>
    </div>
  ),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    vi.spyOn(window, "alert").mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders page", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("CarbonWise AI")).toBeInTheDocument();

    expect(screen.getByText(/back to home/i)).toBeInTheDocument();

    expect(screen.getByText(/loading:false/i)).toBeInTheDocument();
  });

  it("registers successfully", async () => {
    (api.post as any).mockResolvedValue({
      data: {
        userKey: "user123",
      },
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    const user = userEvent.setup();

    await user.click(screen.getByText("Submit Form"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/users/register", {
        name: "Abhinav",
        email: "abhinav@test.com",
        preferredGoal: "Reduce Emissions",
      });
    });

    expect(saveUserKey).toHaveBeenCalledWith("user123");

    expect(localStorage.getItem("carbonwise_userName")).toBe("Abhinav");

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("shows alert on registration failure", async () => {
    const user = userEvent.setup();

    (api.post as any).mockRejectedValue({
      response: {
        data: "Email already exists",
      },
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Submit Form"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        JSON.stringify("Email already exists"),
      );
    });

    expect(screen.getByText(/loading:false/i)).toBeInTheDocument();
  });

  it("shows error.message when response data is unavailable", async () => {
    const user = userEvent.setup();

    (api.post as any).mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Submit Form"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        JSON.stringify("Network Error"),
      );
    });

    expect(screen.getByText(/loading:false/i)).toBeInTheDocument();
  });

  it("saves an empty user key when API response has no userKey", async () => {
    const user = userEvent.setup();

    (api.post as any).mockResolvedValue({
      data: {},
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Submit Form"));

    await waitFor(() => {
      expect(saveUserKey).toHaveBeenCalledWith("");
    });

    expect(localStorage.getItem("carbonwise_userName")).toBe("Abhinav");

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("handles undefined registration response", async () => {
    const user = userEvent.setup();

    (api.post as any).mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Submit Form"));

    await waitFor(() => {
      expect(saveUserKey).toHaveBeenCalledWith("");
    });

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
