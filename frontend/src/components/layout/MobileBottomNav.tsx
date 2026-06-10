import {
    LayoutDashboard,
    Calculator,
    Target,
    Award,
  } from "lucide-react";
  
  import { NavLink } from "react-router-dom";
  
  export default function MobileBottomNav() {
    return (
      <div
        className="
        lg:hidden
        fixed
        bottom-0
        left-0
        right-0
        bg-white
        border-t
        border-slate-200
        flex
        justify-around
        py-3
        z-50
        "
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `
            flex
            flex-col
            items-center
            text-xs
  
            ${
              isActive
                ? "text-green-600"
                : "text-slate-500"
            }
            `
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
  
        <NavLink
          to="/calculator"
          className={({ isActive }) =>
            `
            flex
            flex-col
            items-center
            text-xs
  
            ${
              isActive
                ? "text-green-600"
                : "text-slate-500"
            }
            `
          }
        >
          <Calculator size={20} />
          Calculator
        </NavLink>
  
        <NavLink
          to="/goals"
          className={({ isActive }) =>
            `
            flex
            flex-col
            items-center
            text-xs
  
            ${
              isActive
                ? "text-green-600"
                : "text-slate-500"
            }
            `
          }
        >
          <Target size={20} />
          Goals
        </NavLink>
  
        <NavLink
          to="/gamification"
          className={({ isActive }) =>
            `
            flex
            flex-col
            items-center
            text-xs
  
            ${
              isActive
                ? "text-green-600"
                : "text-slate-500"
            }
            `
          }
        >
          <Award size={20} />
          Rewards
        </NavLink>
      </div>
    );
  }