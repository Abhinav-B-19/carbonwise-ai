import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

const USER_KEY = "carbonwise_userKey";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders children when userKey exists", () => {
    localStorage.setItem(USER_KEY, "valid-user-key");

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<div>Register Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();

    expect(screen.queryByText("Register Page")).not.toBeInTheDocument();
  });

  it("redirects when userKey is absent", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<div>Register Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Register Page")).toBeInTheDocument();

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("preserves route rendering behavior", () => {
    localStorage.setItem(USER_KEY, "user-key-123");

    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <Routes>
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <>
                  <h1>Settings Page</h1>
                  <p>User settings content</p>
                </>
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<div>Register Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Settings Page")).toBeInTheDocument();

    expect(screen.getByText("User settings content")).toBeInTheDocument();

    expect(screen.queryByText("Register Page")).not.toBeInTheDocument();
  });

  it("does not throw when localStorage is empty", () => {
    expect(() => {
      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<div>Register</div>} />
          </Routes>
        </MemoryRouter>,
      );
    }).not.toThrow();

    expect(screen.getByText("Register")).toBeInTheDocument();
  });
});
