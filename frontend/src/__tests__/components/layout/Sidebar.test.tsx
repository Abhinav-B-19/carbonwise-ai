import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Sidebar from "@/components/layout/Sidebar";
import api from "@/api/api";
import { clearUserKey, getUserName } from "@/services/localStorage";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("@/api/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("@/services/localStorage", () => ({
  clearUserKey: vi.fn(),
  getUserName: vi.fn(),
}));

const mockedApi = vi.mocked(api);
const mockedClearUserKey = vi.mocked(clearUserKey);
const mockedGetUserName = vi.mocked(getUserName);

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedGetUserName.mockReturnValue("Abhinav");
  });

  it("renders branding, user name and navigation items", async () => {
    mockedApi.get.mockResolvedValue({
      data: {},
    });

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalled();
    });

    expect(screen.getByText("CarbonWise AI")).toBeInTheDocument();

    expect(screen.getByText("Abhinav")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /dashboard/i,
      }),
    ).toHaveAttribute("href", "/dashboard");

    expect(
      screen.getByRole("link", {
        name: /calculator/i,
      }),
    ).toHaveAttribute("href", "/calculator");

    expect(
      screen.getByRole("link", {
        name: /goals/i,
      }),
    ).toHaveAttribute("href", "/goals");

    expect(
      screen.getByRole("link", {
        name: /ai coach/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /scenario/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /challenges/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /rewards/i,
      }),
    ).toBeInTheDocument();
  });

  it("loads and displays preferred goal", async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        userKey: "123",
        name: "Abhinav",
        email: "a@test.com",
        preferredGoal: "Reduce transport emissions",
      },
    });

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith("/api/users/profile");
    });

    expect(screen.getByText("Reduce transport emissions")).toBeInTheDocument();
  });

  it("logs out and navigates home", async () => {
    mockedApi.get.mockResolvedValue({
      data: {},
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /logout/i,
      }),
    );

    expect(mockedClearUserKey).toHaveBeenCalledTimes(1);

    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("handles profile load failure", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockedApi.get.mockRejectedValue(new Error("failed"));

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith("/api/users/profile");
    });

    expect(errorSpy).toHaveBeenCalledWith(
      "Unable to load profile",
      expect.any(Error),
    );

    errorSpy.mockRestore();
  });

  it("renders fallback user name", async () => {
    mockedGetUserName.mockReturnValue(null);

    mockedApi.get.mockResolvedValue({
      data: {},
    });

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Eco User")).toBeInTheDocument();
    });
  });

  it("renders active navigation link", async () => {
    mockedApi.get.mockResolvedValue({
      data: {},
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar />
      </MemoryRouter>,
    );

    await waitFor(() => expect(mockedApi.get).toHaveBeenCalled());

    expect(
      screen.getByRole("link", {
        name: /dashboard/i,
      }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
