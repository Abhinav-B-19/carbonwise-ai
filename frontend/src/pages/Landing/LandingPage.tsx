import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Trophy,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const userKey =
      localStorage.getItem(
        "carbonwise_userKey"
      );

    if (userKey) {
      navigate("/dashboard");
      return;
    }

    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}

      <section
        className="
        max-w-7xl
        mx-auto
        px-6
        py-20
        text-center
        "
      >
        <h1
          className="
          text-5xl
          md:text-7xl
          font-bold
          text-slate-900
          "
        >
          CarbonWise AI
        </h1>

        <p
          className="
          mt-6
          text-xl
          text-slate-600
          max-w-3xl
          mx-auto
          "
        >
          Measure your carbon footprint,
          receive AI-powered sustainability
          insights, complete green
          challenges, and build a
          sustainable future.
        </p>

        <button
          onClick={handleGetStarted}
          className="
          mt-10
          inline-flex
          items-center
          gap-2
          bg-green-600
          text-white
          px-8
          py-4
          rounded-xl
          font-semibold
          hover:bg-green-700
          transition
          "
        >
          Get Started

          <ArrowRight size={18} />
        </button>
      </section>

      {/* FEATURES */}

      <section
        className="
        max-w-7xl
        mx-auto
        px-6
        pb-20
        "
      >
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          "
        >
          <div
            className="
            bg-white
            border
            rounded-2xl
            p-6
            shadow-sm
            "
          >
            <Leaf
              className="text-green-600"
              size={32}
            />

            <h3
              className="
              text-xl
              font-semibold
              mt-4
              "
            >
              Carbon Tracking
            </h3>

            <p className="mt-2 text-slate-600">
              Understand your environmental
              impact with detailed carbon
              footprint calculations.
            </p>
          </div>

          <div
            className="
            bg-white
            border
            rounded-2xl
            p-6
            shadow-sm
            "
          >
            <Sparkles
              className="text-green-600"
              size={32}
            />

            <h3
              className="
              text-xl
              font-semibold
              mt-4
              "
            >
              AI Coach
            </h3>

            <p className="mt-2 text-slate-600">
              Receive personalized
              sustainability advice powered
              by AI.
            </p>
          </div>

          <div
            className="
            bg-white
            border
            rounded-2xl
            p-6
            shadow-sm
            "
          >
            <Trophy
              className="text-green-600"
              size={32}
            />

            <h3
              className="
              text-xl
              font-semibold
              mt-4
              "
            >
              Gamification
            </h3>

            <p className="mt-2 text-slate-600">
              Earn points, unlock
              achievements, and build green
              habits every day.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}