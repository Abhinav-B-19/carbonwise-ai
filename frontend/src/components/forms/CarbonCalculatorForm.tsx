import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function CarbonCalculatorForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState({
    carKmPerWeek: "",
    bikeKmPerWeek: "",
    publicTransportKmPerWeek: "",
    flightsPerYear: "",
    electricityKwh: "",
    acHoursPerDay: "",
    dietType: "Mixed",
    onlineDeliveriesPerMonth: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      carKmPerWeek: Number(form.carKmPerWeek || 0),

      bikeKmPerWeek: Number(form.bikeKmPerWeek || 0),

      publicTransportKmPerWeek: Number(form.publicTransportKmPerWeek || 0),

      flightsPerYear: Number(form.flightsPerYear || 0),

      electricityKwh: Number(form.electricityKwh || 0),

      acHoursPerDay: Number(form.acHoursPerDay || 0),

      dietType: form.dietType,

      onlineDeliveriesPerMonth: Number(form.onlineDeliveriesPerMonth || 0),
    });
  };

  return (
    <form
      onSubmit={submit}
      className="
      bg-white
      rounded-2xl
      p-6
      shadow-sm
      "
    >
      <div className="grid gap-5">
        <div>
          <label className="block mb-2" htmlFor="carKmPerWeek">
            Car KM Per Week
          </label>

          <input
            id="carKmPerWeek"
            name="carKmPerWeek"
            aria-label="Car KM Per Week"
            type="number"
            value={form.carKmPerWeek}
            onChange={(e) => updateField("carKmPerWeek", e.target.value)}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="bikeKmPerWeek" className="block mb-2">
            Bike KM Per Week
          </label>

          <input
            id="bikeKmPerWeek"
            name="bikeKmPerWeek"
            aria-label="Bike KM Per Week"
            type="number"
            value={form.bikeKmPerWeek}
            onChange={(e) => updateField("bikeKmPerWeek", e.target.value)}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="publicTransportKmPerWeek" className="block mb-2">
            Public Transport KM Per Week
          </label>

          <input
            id="publicTransportKmPerWeek"
            name="publicTransportKmPerWeek"
            aria-label="Public Transport KM Per Week"
            type="number"
            value={form.publicTransportKmPerWeek}
            onChange={(e) =>
              updateField("publicTransportKmPerWeek", e.target.value)
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="flightsPerYear" className="block mb-2">
            Flights Per Year
          </label>

          <input
            id="flightsPerYear"
            name="flightsPerYear"
            aria-label="Flights Per Year"
            type="number"
            value={form.flightsPerYear}
            onChange={(e) => updateField("flightsPerYear", e.target.value)}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="electricityUsage" className="block mb-2">
            Electricity Usage (kWh)
          </label>

          <input
            id="electricityUsage"
            name="electricityUsage"
            aria-label="Electricity Usage (kWh)"
            type="number"
            value={form.electricityKwh}
            onChange={(e) => updateField("electricityKwh", e.target.value)}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="acHoursPerDay" className="block mb-2">
            AC Hours Per Day
          </label>

          <input
            id="acHoursPerDay"
            name="acHoursPerDay"
            aria-label="AC Hours Per Day"
            type="number"
            value={form.acHoursPerDay}
            onChange={(e) => updateField("acHoursPerDay", e.target.value)}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="dietType" className="block mb-2">
            Diet Type
          </label>

          <select
            id="dietType"
            name="dietType"
            aria-label="Diet Type"
            value={form.dietType}
            onChange={(e) => updateField("dietType", e.target.value)}
            className="w-full border p-3 rounded-lg"
          >
            <option value="Vegetarian">Vegetarian</option>

            <option value="Mixed">Mixed</option>

            <option value="NonVegetarian">Non Vegetarian</option>
          </select>
        </div>

        <div>
          <label htmlFor="onlineDeliveriesPerMonth" className="block mb-2">
            Online Deliveries Per Month
          </label>

          <input
            id="onlineDeliveriesPerMonth"
            name="onlineDeliveriesPerMonth"
            aria-label="Online Deliveries Per Month"
            type="number"
            value={form.onlineDeliveriesPerMonth}
            onChange={(e) =>
              updateField("onlineDeliveriesPerMonth", e.target.value)
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
          bg-green-600
          text-white
          py-3
          rounded-lg
          hover:bg-green-700
          transition
          "
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </div>
    </form>
  );
}
