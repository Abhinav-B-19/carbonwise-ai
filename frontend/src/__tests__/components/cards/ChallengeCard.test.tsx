import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChallengeCard from "@/components/cards/ChallengeCard";

describe("ChallengeCard", () => {
  const challenge = {
    title: "Walk Instead of Driving",
    description: "Walk for short trips today.",
    points: 50,
    carbonSaved: 2,
    completed: false,
  };

  it("renders challenge information", () => {
    render(<ChallengeCard challenge={challenge} onComplete={vi.fn()} />);

    expect(
      screen.getByRole("heading", {
        name: /today's challenge/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(challenge.title)).toBeInTheDocument();

    expect(screen.getByText(challenge.description)).toBeInTheDocument();

    expect(screen.getByText("+50 Points")).toBeInTheDocument();

    expect(screen.getByText("2 kg CO₂e Saved")).toBeInTheDocument();
  });

  it("calls onComplete", async () => {
    const user = userEvent.setup();

    const onComplete = vi.fn();

    render(<ChallengeCard challenge={challenge} onComplete={onComplete} />);

    await user.click(
      screen.getByRole("button", {
        name: /complete challenge/i,
      }),
    );

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(
      <ChallengeCard challenge={challenge} onComplete={vi.fn()} loading />,
    );

    expect(screen.getByRole("button")).toBeDisabled();

    expect(screen.getByText("Completing...")).toBeInTheDocument();
  });

  it("renders completed state", () => {
    render(
      <ChallengeCard
        challenge={{
          ...challenge,
          completed: true,
        }}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByText("Completed")).toBeInTheDocument();

    expect(screen.getByText(/Challenge Completed/i)).toBeInTheDocument();

    expect(screen.getByText(/50 Green Points/i)).toBeInTheDocument();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
