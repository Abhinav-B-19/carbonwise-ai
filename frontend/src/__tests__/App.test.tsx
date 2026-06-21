import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "../App";

vi.mock("../pages/Landing/LandingPage", () => ({
  default: () => <div>Landing</div>,
}));

vi.mock("../pages/Register/RegisterPage", () => ({
  default: () => <div>Register</div>,
}));

vi.mock("../pages/Dashboard/DashboardPage", () => ({
  default: () => <div>Dashboard</div>,
}));

vi.mock("../pages/Calculator/CalculatorPage", () => ({
  default: () => <div>Calculator</div>,
}));

vi.mock("../pages/Goals/GoalsPage", () => ({
  default: () => <div>Goals</div>,
}));

vi.mock("../pages/Challenges/ChallengesPage", () => ({
  default: () => <div>Challenges</div>,
}));

vi.mock("../pages/Gamification/GamificationPage", () => ({
  default: () => <div>Gamification</div>,
}));

vi.mock("../pages/AiCoach/AiCoachPage", () => ({
  default: () => <div>AI Coach</div>,
}));

vi.mock("../pages/Scenario/ScenarioPage", () => ({
  default: () => <div>Scenario</div>,
}));

vi.mock("../pages/AiAssistant/AiAssistantPage", () => ({
  default: () => <div>AI Assistant</div>,
}));

vi.mock("../components/layout/ProtectedRoute", () => ({
  default: ({ children }: any) => children,
}));

describe("App", () => {
  it("renders landing route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("Landing")).toBeInTheDocument();
  });
});
