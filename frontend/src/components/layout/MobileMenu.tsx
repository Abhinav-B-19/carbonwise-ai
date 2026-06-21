import { useEffect, useState } from "react";

import { X, Trophy, Sparkles, Leaf, Award, User, LogOut } from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import api from "../../api/api";

import { clearUserKey, getUserName } from "../../services/localStorage";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface UserProfile {
  userKey: string;
  name: string;
  email: string;
  preferredGoal?: string;
}

const menuItems = [
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

export default function MobileMenu({ open, onClose }: Props) {
  const navigate = useNavigate();

  const userName = getUserName() || "Eco User";

  const [profile, setProfile] = useState<UserProfile>();

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    try {
      const response = await api.get("/api/users/profile");

      setProfile(response?.data ?? {});
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Unable to load profile", error);
      }
    }
  };

  const logout = () => {
    clearUserKey();

    onClose();

    navigate("/");
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="
        fixed
        inset-0
        bg-black/40
        z-50
        "
        onClick={onClose}
      />

      <div
        className="
        fixed
        bottom-0
        left-0
        right-0
        bg-white
        rounded-t-3xl
        p-6
        z-50
        shadow-xl
        max-h-[85vh]
        overflow-y-auto
        "
      >
        <div
          className="
          flex
          justify-between
          items-center
          mb-6
          "
        >
          <h2
            className="
            text-xl
            font-bold
            "
          >
            More Options
          </h2>

          <button
            type="button"
            title="Close menu"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* PROFILE */}

        <div
          className="
          border
          border-slate-200
          rounded-2xl
          p-4
          mb-4
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
                text-xs
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

        {/* MENU */}

        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-3
                  p-4
                  rounded-xl
                  bg-slate-50
                  hover:bg-slate-100
                  "
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          title="Logout"
          aria-label="Logout"
          onClick={logout}
          className="
          w-full
          mt-4
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
    </>
  );
}
