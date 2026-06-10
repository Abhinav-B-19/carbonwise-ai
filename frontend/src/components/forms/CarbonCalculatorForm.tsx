import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function CarbonCalculatorForm({
  onSubmit,
  loading,
}: Props) {
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

  const updateField = (
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    onSubmit({
      carKmPerWeek:
        Number(form.carKmPerWeek || 0),

      bikeKmPerWeek:
        Number(form.bikeKmPerWeek || 0),

      publicTransportKmPerWeek:
        Number(
          form.publicTransportKmPerWeek || 0
        ),

      flightsPerYear:
        Number(form.flightsPerYear || 0),

      electricityKwh:
        Number(form.electricityKwh || 0),

      acHoursPerDay:
        Number(form.acHoursPerDay || 0),

      dietType: form.dietType,

      onlineDeliveriesPerMonth:
        Number(
          form.onlineDeliveriesPerMonth || 0
        ),
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
          <label className="block mb-2">
            Car KM Per Week
          </label>

          <input
            type="number"
            value={form.carKmPerWeek}
            onChange={(e) =>
              updateField(
                "carKmPerWeek",
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2">
            Bike KM Per Week
          </label>

          <input
            type="number"
            value={form.bikeKmPerWeek}
            onChange={(e) =>
              updateField(
                "bikeKmPerWeek",
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2">
            Public Transport KM Per Week
          </label>

          <input
            type="number"
            value={
              form.publicTransportKmPerWeek
            }
            onChange={(e) =>
              updateField(
                "publicTransportKmPerWeek",
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2">
            Flights Per Year
          </label>

          <input
            type="number"
            value={form.flightsPerYear}
            onChange={(e) =>
              updateField(
                "flightsPerYear",
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2">
            Electricity Usage (kWh)
          </label>

          <input
            type="number"
            value={form.electricityKwh}
            onChange={(e) =>
              updateField(
                "electricityKwh",
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2">
            AC Hours Per Day
          </label>

          <input
            type="number"
            value={form.acHoursPerDay}
            onChange={(e) =>
              updateField(
                "acHoursPerDay",
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2">
            Diet Type
          </label>

          <select
            value={form.dietType}
            onChange={(e) =>
              updateField(
                "dietType",
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          >
            <option value="Vegetarian">
              Vegetarian
            </option>

            <option value="Mixed">
              Mixed
            </option>

            <option value="NonVegetarian">
              Non Vegetarian
            </option>
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Online Deliveries Per Month
          </label>

          <input
            type="number"
            value={
              form.onlineDeliveriesPerMonth
            }
            onChange={(e) =>
              updateField(
                "onlineDeliveriesPerMonth",
                e.target.value
              )
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
          {loading
            ? "Calculating..."
            : "Calculate"}
        </button>

      </div>
    </form>
  );
}