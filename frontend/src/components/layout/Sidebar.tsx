import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Calculator,
  Target,
  Trophy,
  Sparkles,
  Leaf,
  Award,
  LogOut,
  User,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import api from "../../api/api";

import { clearUserKey, getUserName } from "../../services/localStorage";

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
    name: "Challenges",
    path: "/challenges",
    icon: Trophy,
  },
  {
    name: "Rewards",
    path: "/gamification",
    icon: Award,
  },
];

interface UserProfile {
  userKey: string;
  name: string;
  email: string;
  preferredGoal?: string;
}

export default function Sidebar() {
  const navigate = useNavigate();

  const userName = getUserName() || "Eco User";

  const [profile, setProfile] = useState<UserProfile>();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/api/users/profile");

      setProfile(response.data);
    } catch (error) {
      console.error("Unable to load profile", error);
    }
  };

  const logout = () => {
    clearUserKey();

    navigate("/");
  };

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

      <div className="mt-auto">
        <div
          className="
          border
          border-slate-200
          rounded-2xl
          p-4
          mb-3
          "
        >
          <div
            className="
            flex
            items-center
            gap-3
            mb-4
            "
          >
            <User size={20} />

            <div>
              <p
                className="
                text-sm
                text-slate-500
                "
              >
                Logged in as
              </p>

              <p
                className="
                font-semibold
                "
              >
                {userName}
              </p>
            </div>
          </div>

          {profile?.preferredGoal && (
            <div
              className="
              border-t
              pt-3
              "
            >
              <p
                className="
                text-xs
                text-slate-500
                mb-1
                "
              >
                🎯 Sustainability Focus
              </p>

              <p
                className="
                text-sm
                font-medium
                text-green-700
                "
              >
                {profile.preferredGoal}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          title="Logout"
          aria-label="Logout"
          onClick={logout}
          className="
          w-full
          flex
          items-center
          justify-center
          gap-2
          bg-red-50
          text-red-600
          border
          border-red-200
          py-3
          rounded-xl
          font-medium
          hover:bg-red-100
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
