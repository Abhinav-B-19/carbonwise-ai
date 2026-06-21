import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";

import CarbonCalculatorForm from "../../components/forms/CarbonCalculatorForm";
import ResultCard from "../../components/cards/ResultCard";

import api from "../../api/api";
import { getUserKey } from "../../services/localStorage";
import type { CarbonCalculationResponse } from "@/types/carbon";

export default function CalculatorPage() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<CarbonCalculationResponse | null>(null);

  const calculate = useCallback(async (formData: any) => {
    try {
      setLoading(true);

      const userKey = getUserKey();

      if (!userKey) {
        toast.error("User not found. Please register again.");
        return;
      }

      const response = await api.post("/api/carbon/calculate", formData, {
        headers: {
          "X-User-Key": userKey,
        },
      });

      setResult(response?.data ?? null);

      toast.success("Carbon footprint calculated successfully!");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error(error);
      }

      toast.error(error?.response?.data?.title ?? "Calculation failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";

    if (score >= 60) return "Good";

    if (score >= 40) return "Moderate";

    if (score >= 20) return "High Impact";

    return "Critical";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";

    if (score >= 60) return "text-lime-600";

    if (score >= 40) return "text-yellow-500";

    if (score >= 20) return "text-orange-500";

    return "text-red-600";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return "🟢";

    if (score >= 60) return "🟢";

    if (score >= 40) return "🟡";

    if (score >= 20) return "🟠";

    return "🔴";
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return "bg-green-600";

    if (score >= 60) return "bg-lime-600";

    if (score >= 40) return "bg-yellow-500";

    if (score >= 20) return "bg-orange-500";

    return "bg-red-600";
  };

  const getLargestContributor = () => {
    if (!result) return null;

    const contributors = [
      {
        name: "Transportation",
        value: result.transportationEmission,
      },
      {
        name: "Home",
        value: result.homeEmission,
      },
      {
        name: "Food",
        value: result.foodEmission,
      },
      {
        name: "Lifestyle",
        value: result.lifestyleEmission,
      },
    ];

    return contributors.sort((a, b) => b.value - a.value)[0];
  };

  const getRecommendations = () => {
    const contributor = getLargestContributor();

    switch (contributor?.name) {
      case "Home":
        return [
          "Reduce AC usage by 1–2 hours/day",
          "Switch to LED lighting",
          "Turn off idle appliances",
          "Use energy-efficient devices",
        ];

      case "Transportation":
        return [
          "Use public transport more often",
          "Consider carpooling",
          "Walk or bike for short trips",
          "Reduce unnecessary travel",
        ];

      case "Food":
        return [
          "Increase plant-based meals",
          "Reduce food waste",
          "Buy local produce",
          "Choose seasonal foods",
        ];

      case "Lifestyle":
        return [
          "Reduce online deliveries",
          "Combine purchases into fewer orders",
          "Reuse and recycle products",
          "Avoid unnecessary packaging",
        ];

      default:
        return [];
    }
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="py-8">
          {/* HERO */}

          <div
            className="
              bg-gradient-to-r
              from-emerald-600
              via-green-600
              to-teal-600
              rounded-3xl
              p-8
              mb-8
              shadow-[0_20px_60px_rgba(5,150,105,0.25)]
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-white/15
                border
                border-white/20
                backdrop-blur-sm
                text-white
                text-sm
                font-medium
                mb-5
              "
            >
              🌍 Carbon Calculator
            </div>

            <h1
              style={{ color: "#ffffff" }}
              className="
                text-5xl
                font-bold
                leading-tight
              "
            >
              Carbon Calculator
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.9)",
              }}
              className="
                mt-4
                text-lg
                max-w-2xl
                leading-relaxed
              "
            >
              Measure your environmental impact and understand your carbon
              footprint.
            </p>
          </div>

          {/* RESULTS */}

          {result && (
            <>
              <div
                className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-4
                mb-8
                "
              >
                <ResultCard
                  title="Transportation"
                  value={result.transportationEmission}
                />

                <ResultCard title="Home" value={result.homeEmission} />

                <ResultCard title="Food" value={result.foodEmission} />

                <ResultCard
                  title="Lifestyle"
                  value={result.lifestyleEmission}
                />

                <ResultCard
                  title="Total Emission"
                  value={result.totalEmission}
                />

                <ResultCard title="Carbon Score" value={result.carbonScore} />
              </div>

              {/* SCORE ANALYSIS */}

              <div
                className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
                border
                border-slate-200
                mb-8
                "
              >
                <h3
                  className="
                  text-2xl
                  font-bold
                  mb-4
                  "
                >
                  Carbon Score Analysis
                </h3>

                <div
                  className={`
                  text-3xl
                  font-bold
                  flex
                  items-center
                  gap-3
                  ${getScoreColor(result.carbonScore)}
                `}
                >
                  {getScoreLabel(result.carbonScore)}

                  <span>{getScoreEmoji(result.carbonScore)}</span>
                </div>

                <div className="mt-5">
                  <div
                    className="
                    w-full
                    bg-slate-200
                    rounded-full
                    h-4
                    overflow-hidden
                    "
                  >
                    <div
                      className={`
                      h-full
                      transition-all
                      duration-1000
                      ${getProgressBarColor(result.carbonScore)}
                    `}
                      style={{
                        width: `${result.carbonScore}%`,
                      }}
                    />
                  </div>

                  <p
                    className="
                    mt-2
                    text-sm
                    text-slate-500
                    "
                  >
                    Score: {result.carbonScore}
                    /100
                  </p>
                </div>

                <p
                  className="
                  mt-5
                  text-slate-600
                  "
                >
                  Higher carbon scores indicate better sustainability practices
                  and lower environmental impact.
                </p>
              </div>

              {/* INSIGHT BOX */}

              <div
                className="
                bg-amber-50
                border
                border-amber-200
                rounded-2xl
                p-6
                mb-8
                "
              >
                <h3
                  className="
                  text-xl
                  font-bold
                  mb-3
                  "
                >
                  💡 Personalized Insight
                </h3>

                <p className="text-slate-700">
                  Your largest contributor is{" "}
                  <strong>{getLargestContributor()?.name}</strong> (
                  {getLargestContributor()?.value?.toFixed(2)} kg CO₂e).
                </p>

                <div className="mt-4">
                  <ul
                    className="
                    list-disc
                    ml-5
                    space-y-2
                    text-slate-700
                    "
                  >
                    {getRecommendations().map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* FORM */}

          <CarbonCalculatorForm onSubmit={calculate} loading={loading} />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
