import { useState } from "react";

import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";

import ScenarioForm from "../../components/forms/ScenarioForm";

import api from "../../api/api";

import { getUserKey } from "../../services/localStorage";

export default function ScenarioPage() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<any>(null);

  const [lastInputs, setLastInputs] = useState<any>(null);

  const simulate = async (formData: any) => {
    try {
      setLoading(true);

      const userKey = getUserKey();

      const response = await api.post(
        `/api/scenario/simulate?userKey=${userKey}`,
        formData,
      );

      setResult(response?.data ?? {});

      setLastInputs(formData);

      toast.success("Simulation completed");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }

      toast.error("Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  const scoreImprovement = result
    ? result.projectedScore - result.currentScore
    : 0;

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
              🔮 Sustainability Simulator
            </div>

            <h1
              style={{ color: "#ffffff" }}
              className="
                  text-5xl
                  font-bold
                  leading-tight
                "
            >
              🔮 Sustainability Simulator
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
              See how lifestyle changes affect your future carbon footprint.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-12
              gap-8
              "
          >
            {/* FORM */}

            <div
              className="
                lg:col-span-4
                "
            >
              <div
                className="
                  lg:sticky
                  lg:top-6
                  "
              >
                <ScenarioForm onSubmit={simulate} loading={loading} />
              </div>
            </div>

            {/* RESULTS */}

            <div
              className="
                lg:col-span-8
                "
            >
              {!result ? (
                <div
                  className="
                    bg-white
                    rounded-3xl
                    p-12
                    text-center
                    shadow-sm
                    border
                    border-slate-200
                    "
                >
                  <div className="text-7xl">🔮</div>

                  <h2
                    className="
                      text-2xl
                      font-bold
                      mt-4
                      "
                  >
                    No simulation yet
                  </h2>

                  <p
                    className="
                      text-slate-500
                      mt-2
                      "
                  >
                    Run a scenario to see your projected sustainability impact.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* METRICS */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-5
                      "
                  >
                    <MetricCard
                      title="Current Emission"
                      value={`${result.currentEmission} kg CO₂e`}
                    />

                    <MetricCard
                      title="Projected Emission"
                      value={`${result.projectedEmission} kg CO₂e`}
                      color="text-green-600"
                    />

                    <MetricCard
                      title="Reduction"
                      value={`${result.reduction} kg CO₂e`}
                      color="text-green-600"
                    />

                    <MetricCard
                      title="Current Score"
                      value={result.currentScore}
                    />

                    <MetricCard
                      title="Projected Score"
                      value={result.projectedScore}
                      color="text-green-600"
                      badge={
                        scoreImprovement > 0
                          ? `+${scoreImprovement} Improvement`
                          : undefined
                      }
                    />
                  </div>

                  {/* SCENARIO SUMMARY */}

                  {lastInputs && (
                    <div
                      className="
                        bg-white
                        rounded-3xl
                        p-6
                        border
                        shadow-sm
                        "
                    >
                      <h2
                        className="
                          text-2xl
                          font-bold
                          mb-4
                          "
                      >
                        📋 Scenario Summary
                      </h2>

                      <div className="space-y-2 text-slate-700">
                        <p>
                          🚗 Car Reduction: {lastInputs.carKmReduction} km/week
                        </p>

                        <p>
                          ❄️ AC Reduction: {lastInputs.acHoursReduction} hrs/day
                        </p>

                        <p>
                          📦 Delivery Reduction: {lastInputs.deliveryReduction}{" "}
                          per month
                        </p>

                        <p>
                          🥗 Vegetarian Diet:{" "}
                          {lastInputs.switchToVegetarian ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI ANALYSIS */}

                  <div
                    className="
                      bg-white
                      rounded-3xl
                      p-6
                      border
                      shadow-sm
                      "
                  >
                    <h2
                      className="
                        text-2xl
                        font-bold
                        mb-4
                        "
                    >
                      💡 Personalized Recommendation
                    </h2>

                    <ReactMarkdown
                      components={{
                        strong: ({ children }) => (
                          <strong
                            className="
                              font-bold
                              text-green-700
                              "
                          >
                            {children}
                          </strong>
                        ),

                        p: ({ children }) => (
                          <p
                            className="
                              mb-4
                              leading-relaxed
                              text-slate-700
                              whitespace-pre-line
                              "
                          >
                            {children}
                          </p>
                        ),

                        li: ({ children }) => (
                          <li
                            className="
                              ml-5
                              list-disc
                              mb-2
                              text-slate-700
                              "
                          >
                            {children}
                          </li>
                        ),
                      }}
                    >
                      {result.aiExplanation}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}

function MetricCard({
  title,
  value,
  color = "",
  badge,
}: {
  title: string;
  value: any;
  color?: string;
  badge?: string;
}) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        p-6
        shadow-sm
        border
        border-slate-200
        "
    >
      <p className="text-slate-500">{title}</p>

      <h2
        className={`
          text-3xl
          font-bold
          mt-2
          ${color}
          `}
      >
        {value}
      </h2>

      {badge && (
        <div
          className="
            inline-flex
            mt-3
            px-3
            py-1
            rounded-full
            bg-green-100
            text-green-700
            text-sm
            font-medium
            "
        >
          {badge}
        </div>
      )}
    </div>
  );
}
