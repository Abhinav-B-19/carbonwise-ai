import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import PageLoader from "../../components/ui/PageLoader";

import api from "../../api/api";

import { getUserKey } from "../../services/localStorage";

interface AiHistoryItem {
  insight: string;
  createdAt: string;
}

export default function AiCoachPage() {
  const [insight, setInsight] = useState("");

  const [generatedAt, setGeneratedAt] = useState("");

  const [history, setHistory] = useState<AiHistoryItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const userKey = getUserKey();

      const response = await api.get(`/api/ai/history?userKey=${userKey}`);

      const historyData = response?.data ?? [];

      if (historyData.length > 0) {
        const latest = historyData[0];

        setInsight(latest.insight);

        setGeneratedAt(latest.createdAt);

        setHistory(historyData.slice(1));
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const generateAdvice = async () => {
    try {
      setLoading(true);

      const userKey = getUserKey();

      const response = await api.post(`/api/ai/coach?userKey=${userKey}`);

      setInsight(response?.data?.insight ?? "");

      setGeneratedAt(response?.data?.generatedAt ?? new Date());

      toast.success("AI advice generated");

      loadHistory();
    } catch (error) {
      console.error(error);

      toast.error("Unable to generate advice");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageLoader />
        </PageContainer>
      </DashboardLayout>
    );
  }

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
              🤖 AI Powered Sustainability
            </div>

            <h1
              style={{
                color: "#ffffff",
              }}
              className="
    text-5xl
    font-bold
    "
            >
              AI Sustainability Coach
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.9)",
              }}
              className="
    mt-4
    text-lg
    max-w-2xl
    "
            >
              Get personalized sustainability advice based on your carbon
              footprint history and lifestyle patterns.
            </p>
          </div>

          {/* AI CARD */}

          <div
            className="
              bg-white
              rounded-3xl
              p-8
              shadow-sm
              border
              border-slate-200
              mb-8
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
                  text-2xl
                  font-bold
                  "
              >
                AI Analysis
              </h2>

              <button
                onClick={generateAdvice}
                disabled={loading}
                className="
                  bg-green-600
                  text-white
                  px-5
                  py-3
                  rounded-xl
                  font-semibold
                  hover:bg-green-700
                  disabled:opacity-50
                  "
              >
                {loading ? "Generating..." : "Generate New Insight"}
              </button>
            </div>

            {insight ? (
              <>
                <div
                  className="
                    bg-green-50
                    border
                    border-green-200
                    rounded-2xl
                    p-6
                    "
                >
                  <h3
                    className="
                      font-bold
                      text-green-700
                      mb-3
                      "
                  >
                    💡 AI Insight
                  </h3>

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

                      p: ({ children }) => <p className="mb-3">{children}</p>,

                      li: ({ children }) => (
                        <li
                          className="
                            ml-5
                            list-disc
                            mb-1
                            "
                        >
                          {children}
                        </li>
                      ),
                    }}
                  >
                    {insight}
                  </ReactMarkdown>
                </div>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-4
                    "
                >
                  Generated: {new Date(generatedAt).toLocaleString()}
                </p>
              </>
            ) : (
              <div
                className="
                  text-center
                  py-10
                  text-slate-500
                  "
              >
                Generate AI advice to receive personalized sustainability
                insights.
              </div>
            )}
          </div>

          {/* HISTORY */}

          {history.length > 0 && (
            <div
              className="
    bg-white
    rounded-3xl
    p-8
    shadow-sm
    border
    border-slate-200
    "
            >
              <h2
                className="
      text-2xl
      font-bold
      mb-6
      "
              >
                Previous Insights
              </h2>

              <div className="space-y-4">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="
          bg-slate-50
          border
          rounded-2xl
          p-5
          "
                  >
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

                        p: ({ children }) => <p className="mb-3">{children}</p>,

                        li: ({ children }) => (
                          <li
                            className="
                  ml-5
                  list-disc
                  mb-1
                  "
                          >
                            {children}
                          </li>
                        ),
                      }}
                    >
                      {item.insight}
                    </ReactMarkdown>

                    <p
                      className="
            text-xs
            text-slate-500
            mt-3
            "
                    >
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
