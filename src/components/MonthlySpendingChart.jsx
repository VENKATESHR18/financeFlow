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

function MonthlySpendingChart() {
  const { transactions } = useFinance();

  const monthlyExpenses = {};

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const date = new Date(transaction.date);

      if (isNaN(date.getTime())) return;

      const month = date.toLocaleString("en-US", {
        month: "short",
      });

      if (!monthlyExpenses[month]) {
        monthlyExpenses[month] = 0;
      }

      monthlyExpenses[month] += Number(transaction.amount);
    });

  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = monthOrder
    .filter((month) => monthlyExpenses[month] !== undefined)
    .map((month) => ({
      month,
      amount: monthlyExpenses[month],
    }));

  const totalExpenses = data.reduce(
    (total, item) => total + item.amount,
    0
  );

  return (
    <div>
      {data.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-xl bg-slate-50 px-6 text-center">
          <h4 className="text-base font-semibold text-slate-700">
            No spending data yet
          </h4>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Add your first expense to see your monthly
            spending trends here.
          </p>
        </div>
      ) : (
        <>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
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
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Expenses",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 8px 24px rgba(15,23,42,0.08)",
                  }}
                />

                <Bar
                  dataKey="amount"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={55}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs text-slate-400">
                Total spending shown
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                ₹{totalExpenses.toLocaleString("en-IN")}
              </p>
            </div>

            <p className="text-xs text-slate-400">
              Monthly expenses
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default MonthlySpendingChart;