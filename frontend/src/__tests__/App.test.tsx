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
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("App", () => {
  const cases = [
    ["/", "Landing"],
    ["/register", "Register"],
    ["/dashboard", "Dashboard"],
    ["/calculator", "Calculator"],
    ["/goals", "Goals"],
    ["/challenges", "Challenges"],
    ["/scenario", "Scenario"],
    ["/gamification", "Gamification"],
    ["/ai-coach", "AI Coach"],
    ["/ai-assistant", "AI Assistant"],
  ] as const;

  it.each(cases)("renders %s route", async (route, text) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText(text)).toBeInTheDocument();
  });
});
