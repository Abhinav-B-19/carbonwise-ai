import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConsentModal from "@/components/chat/ConsentModal";

describe("ConsentModal", () => {
  it("renders nothing when open is false", () => {
    const { container } = render(
      <ConsentModal open={false} onAccept={vi.fn()} onClose={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal content when open is true", () => {
    render(<ConsentModal open onAccept={vi.fn()} onClose={vi.fn()} />);

    expect(
      screen.getByText(/ai sustainability assistant/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /this assistant uses ai to answer sustainability and environmental questions/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/chat history is stored/i)).toBeInTheDocument();

    expect(screen.getByText(/25 messages per day/i)).toBeInTheDocument();

    expect(screen.getByText(/last 100 messages retained/i)).toBeInTheDocument();

    expect(
      screen.getByText(/you can clear history anytime/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /not now/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /accept & continue/i,
      }),
    ).toBeInTheDocument();
  });

  it("calls onClose when Not Now is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ConsentModal open onAccept={vi.fn()} onClose={onClose} />);

    await user.click(
      screen.getByRole("button", {
        name: /not now/i,
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onAccept when Accept & Continue is clicked", async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();

    render(<ConsentModal open onAccept={onAccept} onClose={vi.fn()} />);

    await user.click(
      screen.getByRole("button", {
        name: /accept & continue/i,
      }),
    );

    expect(onAccept).toHaveBeenCalledTimes(1);
  });
});
