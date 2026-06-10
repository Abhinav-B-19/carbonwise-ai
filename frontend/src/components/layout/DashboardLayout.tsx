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
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main
        className="
        lg:ml-64
        min-h-screen
        pb-20
        lg:pb-0
        "
      >
        {children}
      </main>

      <MobileBottomNav />
    </div>
  );
}