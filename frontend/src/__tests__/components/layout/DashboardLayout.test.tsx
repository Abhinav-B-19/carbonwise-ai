import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardLayout from "@/components/layout/DashboardLayout";

vi.mock("@/components/layout/Sidebar", () => ({
  default: () => <div>Mock Sidebar</div>,
}));

vi.mock("@/components/layout/MobileBottomNav", () => ({
  default: () => <div>Mock MobileBottomNav</div>,
}));

vi.mock("@/components/chat/FloatingChatWidget", () => ({
  default: () => <div>Mock FloatingChatWidget</div>,
}));

describe("DashboardLayout", () => {
  it("renders children", () => {
    render(
      <DashboardLayout>
        <div>Dashboard Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("renders Sidebar", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByText("Mock Sidebar")).toBeInTheDocument();
  });

  it("renders MobileBottomNav", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByText("Mock MobileBottomNav")).toBeInTheDocument();
  });

  it("renders FloatingChatWidget", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByText("Mock FloatingChatWidget")).toBeInTheDocument();
  });
});
