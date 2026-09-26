import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useFinance } from "../context/FinanceContext";

function ExpenseBreakdownChart() {
  const { transactions } = useFinance();

  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    const category = transaction.category;

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += Number(transaction.amount);
  });

  const data = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
    .sort((a, b) => b.value - a.value);

  const totalExpenses = data.reduce(
    (total, item) => total + item.value,
    0
  );

  const COLORS = [
    "#10b981",
    "#0f172a",
    "#64748b",
    "#94a3b8",
    "#475569",
    "#334155",
    "#cbd5e1",
  ];

  return (
    <div>
      {/* EMPTY STATE */}

      {data.length === 0 ? (
        <div className="flex h-100 flex-col items-center justify-center rounded-xl bg-slate-50 px-6 text-center">
          <h4 className="text-base font-semibold text-slate-700">
            No spending data yet
          </h4>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Add an expense to see how your spending is
            distributed across categories.
          </p>
        </div>
      ) : (
        <>
          {/* DONUT CHART */}

          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 8px 24px rgba(15,23,42,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER TOTAL */}

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-slate-400">
                Total
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                ₹{totalExpenses.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* CATEGORY LIST */}

          <div className="mt-4">
            <div
              className={`space-y-2 ${
                data.length > 4
                  ? "spending-scroll h-48 overflow-y-auto pr-2"
                  : ""
              }`}
            >
              {data.map((item, index) => {
                const percentage =
                  totalExpenses > 0
                    ? Math.round(
                        (item.value / totalExpenses) * 100
                      )
                    : 0;

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-lg px-2 py-2 transition hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[index % COLORS.length],
                        }}
                      />

                      <span className="truncate text-sm capitalize text-slate-600">
                        {item.name}
                      </span>
                    </div>

                    <div className="ml-3 flex shrink-0 items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {percentage}%
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        ₹{item.value.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {data.length > 4 && (
              <p className="mt-3 text-center text-xs text-slate-400">
                Scroll to view more
              </p>
            )}
          </div>
        </>
      )}

      {/* CUSTOM SCROLLBAR */}

      <style>
        {`
          .spending-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }

          .spending-scroll::-webkit-scrollbar {
            width: 5px;
          }

          .spending-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .spending-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          .spending-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  );
}

export default ExpenseBreakdownChart;