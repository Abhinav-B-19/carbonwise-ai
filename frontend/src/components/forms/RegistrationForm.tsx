import { useState } from "react";

interface Props {
  onSubmit: (
    name: string,
    email: string,
    preferredGoal: string
  ) => void;
  loading: boolean;
}

export default function RegistrationForm({
  onSubmit,
  loading,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredGoal, setPreferredGoal] =
    useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    preferredGoal: "",
  });

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      preferredGoal: "",
    };

    let valid = true;

    if (name.trim().length < 3) {
      newErrors.name =
        "Name must be at least 3 characters.";
      valid = false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email =
        "Please enter a valid email address.";
      valid = false;
    }

    if (!preferredGoal) {
      newErrors.preferredGoal =
        "Please select a sustainability goal.";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(
      name.trim(),
      email.trim(),
      preferredGoal
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
      bg-white
      rounded-2xl
      border
      border-slate-200
      shadow-sm
      p-8
      "
    >
      <h2 className="text-2xl font-bold mb-2">
        Create Your Account
      </h2>

      <p className="text-gray-500 mb-6">
        Start tracking your carbon footprint
        today.
      </p>

      <div className="space-y-5">
        {/* Name */}

        <div>
          <label
            htmlFor="name"
            className="
            block
            text-sm
            font-medium
            text-gray-700
            mb-1
            "
          >
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            aria-label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="
            w-full
            border
            border-gray-300
            rounded-lg
            p-3
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
            "
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}

        <div>
          <label
            htmlFor="email"
            className="
            block
            text-sm
            font-medium
            text-gray-700
            mb-1
            "
          >
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            aria-label="Email Address"
            placeholder="john@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
            w-full
            border
            border-gray-300
            rounded-lg
            p-3
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
            "
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Sustainability Goal */}

        <div>
          <label
            htmlFor="preferredGoal"
            className="
            block
            text-sm
            font-medium
            text-gray-700
            mb-1
            "
          >
            Sustainability Goal
          </label>

          <select
            id="preferredGoal"
            name="preferredGoal"
            aria-label="Sustainability Goal"
            value={preferredGoal}
            onChange={(e) =>
              setPreferredGoal(
                e.target.value
              )
            }
            className="
            w-full
            border
            border-gray-300
            rounded-lg
            p-3
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
            "
          >
            <option value="">
              Select a goal
            </option>

            <option value="Reduce Home Emissions">
              Reduce Home Emissions
            </option>

            <option value="Reduce Transportation Emissions">
              Reduce Transportation Emissions
            </option>

            <option value="Reduce Food Emissions">
              Reduce Food Emissions
            </option>

            <option value="General Sustainability">
              General Sustainability
            </option>
          </select>

          {errors.preferredGoal && (
            <p className="text-red-500 text-sm mt-1">
              {errors.preferredGoal}
            </p>
          )}
        </div>

        {/* Submit Button */}

        <button
          type="submit"
          disabled={loading}
          className="
          w-full
          bg-gradient-to-r
          from-green-500
          to-emerald-600
          text-white
          font-semibold
          py-3
          rounded-lg
          hover:opacity-90
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
          "
        >
          {loading
            ? "Creating Account..."
            : "Get Started"}
        </button>
      </div>
    </form>
  );
}