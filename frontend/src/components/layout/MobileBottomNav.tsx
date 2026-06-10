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
        bottom-0
        left-0
        right-0
        bg-white
        border-t
        border-slate-200
        flex
        justify-around
        py-3
        z-40
        "
      >
        <NavLink
          to="/dashboard"
          className={({
            isActive,
          }) =>
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
          <LayoutDashboard
            size={20}
          />

          Dashboard
        </NavLink>

        <NavLink
          to="/calculator"
          className={({
            isActive,
          }) =>
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
          <Calculator
            size={20}
          />

          Calculator
        </NavLink>

        <NavLink
          to="/goals"
          className={({
            isActive,
          }) =>
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
          <Target
            size={20}
          />

          Goals
        </NavLink>

        <button
          onClick={() =>
            setOpen(true)
          }
          className="
          flex
          flex-col
          items-center
          text-xs
          text-slate-500
          "
        >
          <Menu
            size={20}
          />

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