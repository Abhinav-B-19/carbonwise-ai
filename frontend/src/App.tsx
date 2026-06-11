import React from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from "./pages/Landing/LandingPage";
import RegisterPage from "./pages/Register/RegisterPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import CalculatorPage from "./pages/Calculator/CalculatorPage";
import GoalsPage from "./pages/Goals/GoalsPage";
import ChallengesPage from "./pages/Challenges/ChallengesPage";
import GamificationPage from "./pages/Gamification/GamificationPage";
import AiCoachPage from "./pages/AiCoach/AiCoachPage";
import ScenarioPage from "./pages/Scenario/ScenarioPage";
import AiAssistantPage from "./pages/AiAssistant/AiAssistantPage";

import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/calculator"
        element={
          <ProtectedRoute>
            <CalculatorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <ChallengesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scenario"
        element={
          <ProtectedRoute>
            <ScenarioPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gamification"
        element={
          <ProtectedRoute>
            <GamificationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-coach"
        element={
          <ProtectedRoute>
            <AiCoachPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-assistant"
        element={
          <ProtectedRoute>
            <AiAssistantPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;