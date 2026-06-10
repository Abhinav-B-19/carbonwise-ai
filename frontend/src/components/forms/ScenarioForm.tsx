import {
    useState,
  } from "react";
  
  interface Props {
    onSubmit: (
      data: {
        carKmReduction: number;
        acHoursReduction: number;
        switchToVegetarian: boolean;
        deliveryReduction: number;
      }
    ) => void;
  
    loading: boolean;
  }
  
  export default function ScenarioForm({
    onSubmit,
    loading,
  }: Props) {
    const [
      carKmReduction,
      setCarKmReduction,
    ] = useState("");
  
    const [
      acHoursReduction,
      setAcHoursReduction,
    ] = useState("");
  
    const [
      switchToVegetarian,
      setSwitchToVegetarian,
    ] = useState(false);
  
    const [
      deliveryReduction,
      setDeliveryReduction,
    ] = useState("");
  
    const submit = (
      e: React.FormEvent
    ) => {
      e.preventDefault();
  
      onSubmit({
        carKmReduction:
          Number(
            carKmReduction
          ) || 0,
  
        acHoursReduction:
          Number(
            acHoursReduction
          ) || 0,
  
        switchToVegetarian,
  
        deliveryReduction:
          Number(
            deliveryReduction
          ) || 0,
      });
    };
  
    return (
      <form
        onSubmit={submit}
        className="
        bg-white
        rounded-3xl
        p-6
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
          Scenario Inputs
        </h2>
  
        <div className="space-y-5">
  
          <div>
            <label className="block mb-2">
              Reduce Car Travel
              (km/week)
            </label>
  
            <input
              type="number"
              min="0"
              value={
                carKmReduction
              }
              onChange={(e) =>
                setCarKmReduction(
                  e.target.value
                )
              }
              className="
              w-full
              border
              rounded-xl
              p-3
              "
            />
          </div>
  
          <div>
            <label className="block mb-2">
              Reduce AC Usage
              (hours/day)
            </label>
  
            <input
              type="number"
              min="0"
              value={
                acHoursReduction
              }
              onChange={(e) =>
                setAcHoursReduction(
                  e.target.value
                )
              }
              className="
              w-full
              border
              rounded-xl
              p-3
              "
            />
          </div>
  
          <div>
            <label className="block mb-2">
              Reduce Deliveries
              (per month)
            </label>
  
            <input
              type="number"
              min="0"
              value={
                deliveryReduction
              }
              onChange={(e) =>
                setDeliveryReduction(
                  e.target.value
                )
              }
              className="
              w-full
              border
              rounded-xl
              p-3
              "
            />
          </div>
  
          <label
            className="
            flex
            items-center
            gap-3
            "
          >
            <input
              type="checkbox"
              checked={
                switchToVegetarian
              }
              onChange={(e) =>
                setSwitchToVegetarian(
                  e.target.checked
                )
              }
            />
  
            Switch To Vegetarian Diet
          </label>
  
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
            disabled:opacity-50
            "
          >
            {loading
              ? "Running..."
              : "Run Simulation"}
          </button>
  
        </div>
      </form>
    );
  }