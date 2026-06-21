import { render, screen } from "@testing-library/react";
import AiInsightCard from "@/components/cards/AiInsightCard";

describe("AiInsightCard", () => {
  it("renders the card title", () => {
    render(<AiInsightCard insight="Reduce car usage by 20%." />);

    expect(screen.getByText("AI Sustainability Insight")).toBeInTheDocument();
  });

  it("renders the provided insight", () => {
    const insight = "Reduce car usage by 20%.";

    render(<AiInsightCard insight={insight} />);

    expect(screen.getByText(insight)).toBeInTheDocument();
  });
});
