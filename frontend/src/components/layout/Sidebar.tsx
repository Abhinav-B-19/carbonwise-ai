import {
    LayoutDashboard,
    Calculator,
    Target,
    Trophy,
    Sparkles,
    Leaf,
    Award,
  } from "lucide-react";
  
  import { NavLink } from "react-router-dom";
  
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Calculator",
      path: "/calculator",
      icon: Calculator,
    },
    {
      name: "Goals",
      path: "/goals",
      icon: Target,
    },
    {
      name: "Challenges",
      path: "/challenges",
      icon: Trophy,
    },
    {
      name: "AI Coach",
      path: "/ai-coach",
      icon: Sparkles,
    },
    {
      name: "Scenario",
      path: "/scenario",
      icon: Leaf,
    },
    {
      name: "Rewards",
      path: "/gamification",
      icon: Award,
    },
  ];
  
  export default function Sidebar() {
    return (
      <aside
        className="
          hidden
          lg:flex
          flex-col
          fixed
          left-0
          top-0
          w-64
          h-screen
          bg-white
          border-r
          border-slate-200
          p-5
          z-40
        "
      >
        <h1
          className="
            text-2xl
            font-bold
            text-green-600
            mb-8
          "
        >
          CarbonWise AI
        </h1>
  
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
  
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  transition-all
  
                  ${
                    isActive
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }
                  `
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    );
  }