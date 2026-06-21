import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../../api/api";
import RegistrationForm from "../../components/forms/RegistrationForm";

import { saveUserKey } from "../../services/localStorage";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const register = async (
    name: string,
    email: string,
    preferredGoal: string,
  ) => {
    try {
      setLoading(true);

      const response = await api.post("/api/users/register", {
        name,
        email,
        preferredGoal,
      });

      saveUserKey(response?.data?.userKey ?? "");

      localStorage.setItem("carbonwise_userName", name);

      navigate("/dashboard");
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Registration Error:", error);
      }

      alert(JSON.stringify(error?.response?.data ?? error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      grid
      grid-cols-1
      lg:grid-cols-2
      "
    >
      {/* Left Side */}

      <div
        className="
        bg-gradient-to-br
        from-green-500
        to-emerald-700
        text-white
        flex
        items-center
        justify-center
        p-10
        "
      >
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">CarbonWise AI</h1>

          <p className="mt-4 text-lg opacity-90">
            Measure your carbon footprint, receive AI-powered insights, complete
            green challenges and build sustainable habits.
          </p>
        </div>
      </div>

      {/* Right Side */}

      <div
        className="
        flex
        items-center
        justify-center
        p-6
        "
      >
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="
            inline-flex
            items-center
            gap-2
            text-gray-600
            mb-4
            hover:text-green-600
            transition
            "
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <RegistrationForm loading={loading} onSubmit={register} />
        </div>
      </div>
    </div>
  );
}
