import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useFinance } from "../context/FinanceContext";

function IncomeExpenseChart() {
  const { transactions } = useFinance();

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => {
      return total + Number(transaction.amount);
    }, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => {
      return total + Number(transaction.amount);
    }, 0);

  const hasFinancialData =
    totalIncome > 0 || totalExpenses > 0;

  const netSavings = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0
      ? Math.round((netSavings / totalIncome) * 100)
      : 0;

  const data = [
    {
      name: "Overall",
      Income: totalIncome,
      Expenses: totalExpenses,
    },
  ];

  return (
    <div>
      {!hasFinancialData ? (
        <div className="flex h-[380px] flex-col items-center justify-center rounded-xl bg-slate-50 px-6 text-center">
          <h4 className="text-base font-semibold text-slate-700">
            No financial data yet
          </h4>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Add income and expense transactions to compare
            your finances and track your savings rate.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Information */}

          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs font-medium text-emerald-700">
                Income
              </p>

              <p className="mt-1 text-lg font-bold text-emerald-700">
                ₹{totalIncome.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Expenses
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                ₹{totalExpenses.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Savings Rate
              </p>

              <p
                className={`mt-1 text-lg font-bold ${
                  savingsRate >= 0
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {savingsRate}%
              </p>
            </div>
          </div>

          {/* Chart */}

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                barCategoryGap="45%"
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 13,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  tickFormatter={(value) =>
                    `₹${value.toLocaleString("en-IN")}`
                  }
                />

                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 8px 24px rgba(15, 23, 42, 0.08)",
                  }}
                />

                <Bar
                  dataKey="Income"
                  fill="#10b981"
                  barSize={55}
                  radius={[8, 8, 0, 0]}
                />

                <Bar
                  dataKey="Expenses"
                  fill="#0f172a"
                  barSize={55}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Net Savings Information */}

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs text-slate-400">
                Net savings
              </p>

              <p
                className={`mt-1 text-sm font-semibold ${
                  netSavings >= 0
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {netSavings >= 0 ? "+" : "-"}₹
                {Math.abs(netSavings).toLocaleString("en-IN")}
              </p>
            </div>

            <p className="text-xs text-slate-400">
              Income − Expenses
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default IncomeExpenseChart;