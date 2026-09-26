import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Finance() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [frequency, setFrequency] = useState("1");

  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const calculateFinance = (e) => {
    e.preventDefault();

    const P = Number(principal);
    const R = Number(rate);
    const T = Number(years);

    const newErrors = {};

    if (!principal) {
      newErrors.principal =
        "Please enter the principal amount.";
    } else if (P <= 0) {
      newErrors.principal =
        "Principal amount must be greater than ₹0.";
    }

    if (rate === "") {
      newErrors.rate =
        "Please enter an interest rate.";
    } else if (R < 0) {
      newErrors.rate =
        "Interest rate cannot be negative.";
    }

    if (!years) {
      newErrors.years =
        "Please enter the investment period.";
    } else if (T <= 0) {
      newErrors.years =
        "Time must be greater than 0 years.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // ==================== SIMPLE INTEREST ====================

    const simpleInterest = (P * R * T) / 100;
    const simpleAmount = P + simpleInterest;

    // ==================== COMPOUND INTEREST ====================

    const n = Number(frequency);

    const compoundAmount =
      P * Math.pow(1 + R / (100 * n), n * T);

    const compoundInterest =
      compoundAmount - P;

    // ==================== GROWTH ====================

    const growthPercentage =
      ((compoundAmount - P) / P) * 100;

    // ==================== CHART DATA ====================

    const chartData = [];

    for (let year = 0; year <= T; year++) {
      const simpleValue =
        P + (P * R * year) / 100;

      const compoundValue =
        P *
        Math.pow(
          1 + R / (100 * n),
          n * year
        );

      chartData.push({
        year: `Year ${year}`,
        simple: Number(simpleValue.toFixed(2)),
        compound: Number(compoundValue.toFixed(2)),
      });
    }

    setResult({
      simpleInterest,
      simpleAmount,
      compoundInterest,
      compoundAmount,
      growthPercentage,
      chartData,
    });
  };

  const resetCalculator = () => {
    setPrincipal("");
    setRate("");
    setYears("");
    setFrequency("1");
    setResult(null);
    setErrors({});
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  const errorStyle =
    "mt-1.5 text-xs text-red-500";

  return (
    <div className="animate-fade-up">
      {/* ==================== PAGE HEADER ==================== */}

      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Finance Tools
        </p>

        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Finance Calculator
        </h2>

        <p className="mtx-2 text-sm text-slate-500">
          Calculate simple and compound interest and
          understand your potential returns.
        </p>
      </div>

      {/* ==================== CALCULATOR + INFORMATION ==================== */}

      <div className="grid gap-6 lg:grid-cols-5">

        {/* ==================== CALCULATOR ==================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-3">

          <div className="mb-6">
            <p className="text-sm font-medium text-emerald-600">
              Calculator
            </p>

            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              Investment Details
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter your investment details below.
            </p>
          </div>

          <form
            onSubmit={calculateFinance}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >

            {/* ==================== PRINCIPAL ==================== */}

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Principal Amount
              </label>

              <input
                type="number"
                min="1"
                step="0.01"
                value={principal}
                onChange={(e) => {
                  setPrincipal(e.target.value);

                  setErrors((previous) => ({
                    ...previous,
                    principal: "",
                  }));
                }}
                placeholder="₹ 1,00,000"
                className={`${inputStyle} ${
                  errors.principal
                    ? "border-red-300"
                    : ""
                }`}
                required
              />

              {errors.principal && (
                <p className={errorStyle}>
                  {errors.principal}
                </p>
              )}
            </div>

            {/* ==================== INTEREST RATE ==================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Interest Rate (%)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={rate}
                onChange={(e) => {
                  setRate(e.target.value);

                  setErrors((previous) => ({
                    ...previous,
                    rate: "",
                  }));
                }}
                placeholder="8"
                className={`${inputStyle} ${
                  errors.rate
                    ? "border-red-300"
                    : ""
                }`}
                required
              />

              {errors.rate && (
                <p className={errorStyle}>
                  {errors.rate}
                </p>
              )}
            </div>

            {/* ==================== YEARS ==================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Time (Years)
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={years}
                onChange={(e) => {
                  setYears(e.target.value);

                  setErrors((previous) => ({
                    ...previous,
                    years: "",
                  }));
                }}
                placeholder="5"
                className={`${inputStyle} ${
                  errors.years
                    ? "border-red-300"
                    : ""
                }`}
                required
              />

              {errors.years && (
                <p className={errorStyle}>
                  {errors.years}
                </p>
              )}
            </div>

            {/* ==================== COMPOUNDING FREQUENCY ==================== */}

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Compounding Frequency
              </label>

              <div className="relative">
                <select
                  value={frequency}
                  onChange={(e) =>
                    setFrequency(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition duration-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="1">
                    Annually
                  </option>

                  <option value="2">
                    Half-Yearly
                  </option>

                  <option value="4">
                    Quarterly
                  </option>

                  <option value="12">
                    Monthly
                  </option>
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  ▼
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Choose how often compound interest is added.
              </p>
            </div>

            {/* ==================== BUTTONS ==================== */}

            <div className="flex gap-3 sm:col-span-2">

              <button
                type="submit"
                className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
              >
                Calculate
              </button>

              <button
                type="button"
                onClick={resetCalculator}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Reset
              </button>

            </div>
          </form>
        </section>

        {/* ==================== QUICK INFORMATION ==================== */}

        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">

          <p className="text-sm font-medium text-emerald-600">
            Overview
          </p>

          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            What you'll get
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Compare how your money grows using simple
            interest and compound interest.
          </p>

          <div className="mt-6 space-y-3">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-medium text-slate-900">
                Simple Interest
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Interest is calculated only on the original
                principal amount.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-medium text-slate-900">
                Compound Interest
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Interest is calculated on the principal plus
                accumulated interest.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-medium text-slate-900">
                Compounding Frequency
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                More frequent compounding can increase the
                final amount over time.
              </p>
            </div>

          </div>
        </section>
      </div>

      {/* ==================== RESULTS ==================== */}

      {result && (
        <>
          {/* ==================== INVESTMENT SUMMARY ==================== */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

            <div className="mb-6">
              <p className="text-sm font-medium text-emerald-600">
                Results
              </p>

              <h3 className="mt-1 text-xl font-semibold text-slate-900">
                Investment Summary
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your estimated returns based on the values entered.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Principal */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Principal
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  ₹
                  {Number(principal).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>

              {/* Interest Earned */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Interest Earned
                </p>

                <p className="mt-2 text-xl font-bold text-emerald-600">
                  ₹
                  {result.compoundInterest.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>

              {/* Final Amount */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Final Amount
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  ₹
                  {result.compoundAmount.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>

              {/* Growth */}

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-sm text-emerald-700">
                  Total Growth
                </p>

                <p className="mt-2 text-xl font-bold text-emerald-700">
                  {result.growthPercentage.toFixed(2)}%
                </p>
              </div>

            </div>
          </section>

          {/* ==================== COMPARISON ==================== */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

            <div className="mb-6">
              <p className="text-sm font-medium text-emerald-600">
                Comparison
              </p>

              <h3 className="mt-1 text-xl font-semibold text-slate-900">
                Simple vs Compound Interest
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Compare the interest earned using both methods.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Simple Interest */}

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Simple Interest
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  ₹
                  {result.simpleInterest.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Final amount: ₹
                  {result.simpleAmount.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>

              {/* Compound Interest */}

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-sm text-emerald-700">
                  Compound Interest
                </p>

                <p className="mt-2 text-xl font-bold text-emerald-700">
                  ₹
                  {result.compoundInterest.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>

                <p className="mt-1 text-xs text-emerald-600">
                  Final amount: ₹
                  {result.compoundAmount.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>

            </div>

            {/* Difference */}

            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-5">

              <p className="text-sm font-medium text-emerald-700">
                Compound Interest Difference
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-800">
                ₹
                {(
                  result.compoundAmount -
                  result.simpleAmount
                ).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>

              <p className="mt-1 text-xs text-emerald-700">
                Additional amount compared with simple interest.
              </p>

            </div>
          </section>

          {/* ==================== GROWTH CHART ==================== */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

            <div className="mb-6">
              <p className="text-sm font-medium text-emerald-600">
                Visualization
              </p>

              <h3 className="mt-1 text-xl font-semibold text-slate-900">
                Investment Growth
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                See how your investment grows over time.
              </p>
            </div>

            <div className="h-[320px] w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={result.chartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="year"
                    tick={{
                      fontSize: 12,
                      fill: "#64748b",
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: "#64748b",
                    }}
                    tickFormatter={(value) =>
                      `₹${value.toLocaleString("en-IN")}`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}`
                    }
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="simple"
                    name="Simple Interest"
                    stroke="#64748b"
                    strokeWidth={2}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="compound"
                    name="Compound Interest"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Finance;