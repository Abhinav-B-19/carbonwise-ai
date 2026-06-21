import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import MobileMenu from "@/components/layout/MobileMenu";
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

const mockedGet = vi.mocked(api.get);
const mockedClearUserKey = vi.mocked(clearUserKey);
const mockedGetUserName = vi.mocked(getUserName);

beforeEach(() => {
  vi.clearAllMocks();

  mockedGetUserName.mockReturnValue("Abhinav");
});

describe("MobileMenu", () => {
  it("renders nothing when closed", () => {
    render(
      <MemoryRouter>
        <MobileMenu open={false} onClose={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("More Options")).not.toBeInTheDocument();
  });

  it("renders profile and menu items when open", async () => {
    mockedGet.mockResolvedValue({
      data: {
        userKey: "123",
        name: "Abhinav",
        email: "test@test.com",
        preferredGoal: "Reduce transport emissions",
      },
    });

    render(
      <MemoryRouter>
        <MobileMenu open onClose={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText("More Options")).toBeInTheDocument();

    expect(screen.getByText("Abhinav")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Reduce transport emissions"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("link", {
        name: /challenges/i,
      }),
    ).toBeInTheDocument();

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
        name: /rewards/i,
      }),
    ).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    mockedGet.mockResolvedValue({
      data: {},
    });

    const user = userEvent.setup();

    const onClose = vi.fn();

    render(
      <MemoryRouter>
        <MobileMenu open onClose={onClose} />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /close menu/i,
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clears user and navigates home on logout", async () => {
    mockedGet.mockResolvedValue({
      data: {},
    });

    const user = userEvent.setup();

    const onClose = vi.fn();

    render(
      <MemoryRouter>
        <MobileMenu open onClose={onClose} />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /logout/i,
      }),
    );

    expect(mockedClearUserKey).toHaveBeenCalled();

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });

    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("calls onClose when backdrop is clicked", async () => {
    mockedGet.mockResolvedValue({
      data: {},
    });

    const onClose = vi.fn();

    render(
      <MemoryRouter>
        <MobileMenu open onClose={onClose} />
      </MemoryRouter>,
    );

    const backdrop = document.querySelector(".bg-black\\/40");

    expect(backdrop).toBeTruthy();

    backdrop?.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
      }),
    );

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("handles profile load failure", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockedGet.mockRejectedValue(new Error("failed"));

    render(
      <MemoryRouter>
        <MobileMenu open onClose={vi.fn()} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
    });

    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it("renders fallback user name", async () => {
    mockedGetUserName.mockReturnValue(null);

    mockedGet.mockResolvedValue({
      data: {},
    });

    render(
      <MemoryRouter>
        <MobileMenu open onClose={vi.fn()} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Eco User")).toBeInTheDocument();
    });
  });
});
