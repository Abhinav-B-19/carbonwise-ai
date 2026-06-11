import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import FloatingChatWidget from "../chat/FloatingChatWidget";

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
        pb-10
        "
      >
        {children}
      </main>

      <MobileBottomNav />

      <FloatingChatWidget />
    </div>
  );
}