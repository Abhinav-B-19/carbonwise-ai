import {
  useState,
} from "react";

import {
  LayoutDashboard,
  Calculator,
  Target,
  Menu,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import MobileMenu from "./MobileMenu";

export default function MobileBottomNav() {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      <div
        className="
        lg:hidden
        fixed
        left-0
        right-0
        bottom-0
        w-screen
        bottom-0
        bg-white
        border-t
        border-slate-200
        flex
        justify-around
        items-center
        h-16
        z-[9999]
        shadow-[0_-2px_10px_rgba(0,0,0,0.08)]
        "
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `
            flex
            flex-col
            items-center
            justify-center
            text-xs
            flex-1
            h-full

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
            justify-center
            text-xs
            flex-1
            h-full

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
            justify-center
            text-xs
            flex-1
            h-full

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

        <button
          type="button"
          title="More options"
          aria-label="More options"
          onClick={() =>
            setOpen(true)
          }
          className="
          flex
          flex-col
          items-center
          justify-center
          text-xs
          text-slate-500
          flex-1
          h-full
          "
        >
          <Menu size={20} />
          More
        </button>
      </div>

      <MobileMenu
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </>
  );
}