import React, { Suspense, lazy } from "react";

import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing/LandingPage";
import PageLoader from "./components/ui/PageLoader";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Lazy-loaded protected pages
const RegisterPage = lazy(() => import("./pages/Register/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const CalculatorPage = lazy(() => import("./pages/Calculator/CalculatorPage"));
const GoalsPage = lazy(() => import("./pages/Goals/GoalsPage"));
const ChallengesPage = lazy(() => import("./pages/Challenges/ChallengesPage"));
const GamificationPage = lazy(
  () => import("./pages/Gamification/GamificationPage"),
);
const AiCoachPage = lazy(() => import("./pages/AiCoach/AiCoachPage"));
const ScenarioPage = lazy(() => import("./pages/Scenario/ScenarioPage"));
const AiAssistantPage = lazy(
  () => import("./pages/AiAssistant/AiAssistantPage"),
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/register"
        element={
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/calculator"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <CalculatorPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <GoalsPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ChallengesPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/scenario"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ScenarioPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gamification"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <GamificationPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-coach"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AiCoachPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-assistant"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AiAssistantPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
