import {
    Car,
    Home,
    Utensils,
    Package,
    Globe,
    Leaf,
  } from "lucide-react";
  
  interface Props {
    title: string;
    value: number;
  }
  
  export default function ResultCard({
    title,
    value,
  }: Props) {
    const getIcon = () => {
      switch (title) {
        case "Transportation":
          return <Car size={20} />;
  
        case "Home":
          return <Home size={20} />;
  
        case "Food":
          return <Utensils size={20} />;
  
        case "Lifestyle":
          return <Package size={20} />;
  
        case "Total Emission":
          return <Globe size={20} />;
  
        case "Carbon Score":
          return <Leaf size={20} />;
  
        default:
          return null;
      }
    };
  
    const getStatus = () => {
      if (title === "Carbon Score") {
        if (value >= 80)
          return {
            bg: "bg-green-50",
            color: "text-green-600",
            label: "Excellent",
          };
  
        if (value >= 60)
          return {
            bg: "bg-lime-50",
            color: "text-lime-600",
            label: "Good",
          };
  
        if (value >= 40)
          return {
            bg: "bg-yellow-50",
            color: "text-yellow-600",
            label: "Moderate",
          };
  
        if (value >= 20)
          return {
            bg: "bg-orange-50",
            color: "text-orange-600",
            label: "Poor",
          };
  
        return {
          bg: "bg-red-50",
          color: "text-red-600",
          label: "Critical",
        };
      }
  
      if (value < 100)
        return {
          bg: "bg-green-50",
          color: "text-green-600",
          label: "Low",
        };
  
      if (value < 300)
        return {
          bg: "bg-yellow-50",
          color: "text-yellow-600",
          label: "Moderate",
        };
  
      return {
        bg: "bg-red-50",
        color: "text-red-600",
        label: "High",
      };
    };
  
    const status = getStatus();
  
    return (
      <div
        className={`
        rounded-2xl
        border
        p-6
        shadow-sm
        ${status.bg}
        `}
      >
        <div
          className="
          flex
          items-center
          gap-2
          text-slate-500
          "
        >
          {getIcon()}
          <span>{title}</span>
        </div>
  
        <h2
          className={`
          text-4xl
          font-bold
          mt-4
          ${status.color}
          `}
        >
          {value}
        </h2>
  
        <p
          className="
          text-sm
          text-slate-500
          mt-1
          "
        >
          {title === "Carbon Score"
            ? "/100"
            : "kg CO₂e"}
        </p>
  
        <p
          className={`
          mt-3
          font-medium
          ${status.color}
          `}
        >
          {status.label}
        </p>
      </div>
    );
  }