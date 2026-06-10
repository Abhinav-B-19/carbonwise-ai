import {
    X,
    Trophy,
    Sparkles,
    Leaf,
    Award,
  } from "lucide-react";
  
  import {
    NavLink,
  } from "react-router-dom";
  
  interface Props {
    open: boolean;
    onClose: () => void;
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
  
  export default function MobileMenu({
    open,
    onClose,
  }: Props) {
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
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>
  
          <div className="space-y-3">
  
            {menuItems.map(
              (item) => {
                const Icon =
                  item.icon;
  
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={
                      onClose
                    }
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
                    <Icon
                      size={20}
                    />
  
                    {item.name}
                  </NavLink>
                );
              }
            )}
  
          </div>
  
        </div>
  
      </>
    );
  }