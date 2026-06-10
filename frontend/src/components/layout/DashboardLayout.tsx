import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div
      className="
      min-h-screen
      bg-slate-50
      overflow-x-hidden
      "
    >
      <Sidebar />

      <main
        className="
        lg:ml-64
        min-h-screen
        pb-28
        "
      >
        {children}
      </main>

      <MobileBottomNav />
    </div>
  );
}