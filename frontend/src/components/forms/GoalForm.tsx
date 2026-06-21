import { useState } from "react";

interface Props {
  onSubmit: (goalType: string, targetValue: number) => void;

  loading: boolean;
}

const goalTypes = [
  "Improve Carbon Score",
  "Reduce Total Emissions",
  "General Sustainability",
];

export default function CreateGoalForm({ onSubmit, loading }: Props) {
  const [goalType, setGoalType] = useState(goalTypes[0]);

  const [targetValue, setTargetValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetValue) return;

    onSubmit(goalType, Number(targetValue));

    setTargetValue("");
  };

  return (
    <form
      onSubmit={submit}
      className="
      bg-white
      rounded-2xl
      p-6
      shadow-sm
      border
      border-slate-200
      min-h-[500px]
      "
    >
      <h2
        className="
        text-2xl
        font-bold
        mb-6
        "
      >
        🎯 Create New Goal
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Goal Type</label>

          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
            className="
            w-full
            border
            rounded-xl
            p-3
            "
          >
            {goalTypes.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Target Goal Value
          </label>

          <input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            required
            min="1"
            placeholder="Example: 20"
            className="
            w-full
            border
            rounded-xl
            p-3
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
          w-full
          bg-green-600
          text-white
          py-3
          rounded-xl
          font-semibold
          hover:bg-green-700
          "
        >
          {loading ? "Creating..." : "Create Goal"}
        </button>
      </div>
    </form>
  );
}
