import { useFinance } from "../context/FinanceContext.jsx";

function ExpenseRanking() {
  const { transactions, budgets } = useFinance();

  // ==================== CURRENT MONTH ====================

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // ==================== CURRENT MONTH EXPENSES ====================

  const expenses = transactions.filter((transaction) => {
    if (transaction.type !== "expense") {
      return false;
    }

    const transactionDate = new Date(transaction.date);

    if (isNaN(transactionDate.getTime())) {
      return false;
    }

    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  // ==================== CATEGORY TOTALS ====================

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    const category = transaction.category;

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += Number(transaction.amount);
  });

  // ==================== SORT RANKING ====================

  const ranking = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  // ==================== GET BUDGET ====================

  const getBudget = (category) => {
    return budgets.find(
      (budget) => budget.category === category
    );
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* ==================== HEADER ==================== */}

      <div>
        <p className="text-sm font-medium text-emerald-600">
          Analysis
        </p>

        <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Spending Ranking
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Your highest spending categories this month.
        </p>
      </div>

      {/* ==================== RANKING ==================== */}

      {ranking.length === 0 ? (
        <div className="mt-6 flex flex-1 items-center justify-center rounded-xl bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-400">
            Add an expense this month to see your spending ranking.
          </p>
        </div>
      ) : (
        <div
          className="ranking-scroll mt-6 overflow-y-auto pr-2"
          style={{ height: "283px" }}
        >
          <div className="space-y-3">

            {ranking.map(([category, amount], index) => {
              const budget = getBudget(category);

              const budgetAmount = budget
                ? Number(budget.amount)
                : 0;

              const budgetPercentage =
                budgetAmount > 0
                  ? (amount / budgetAmount) * 100
                  : 0;

              const progressWidth = Math.min(
                budgetPercentage,
                100
              );

              const remaining = budgetAmount - amount;

              let statusText = "";
              let statusClass = "";

              if (budget) {
                if (budgetPercentage >= 100) {
                  statusText = "Budget exceeded";
                  statusClass = "text-red-500";
                } else if (budgetPercentage >= 80) {
                  statusText = "Almost reached";
                  statusClass = "text-amber-500";
                } else {
                  statusText = "On track";
                  statusClass = "text-emerald-600";
                }
              }

              return (
                <div
                  key={category}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                >

                  {/* ==================== CATEGORY HEADER ==================== */}

                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-3">

                      {/* Rank */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {index + 1}
                      </div>

                      {/* Category */}
                      <div className="min-w-0">
                        <p className="truncate font-medium capitalize text-slate-800">
                          {category}
                        </p>

                        <p className="text-xs text-slate-400">
                          This month
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <p className="ml-3 shrink-0 text-sm font-semibold text-slate-900">
                      ₹{amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* ==================== BUDGET INFORMATION ==================== */}

                  {budget ? (
                    <div className="mt-4">

                      {/* Budget + Status */}
                      <div className="flex items-center justify-between">

                        <p className="text-xs text-slate-400">
                          Budget: ₹
                          {budgetAmount.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p
                          className={`text-xs font-medium ${statusClass}`}
                        >
                          {statusText}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            budgetPercentage >= 100
                              ? "bg-red-500"
                              : budgetPercentage >= 80
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${progressWidth}%`,
                          }}
                        />
                      </div>

                      {/* Percentage + Remaining */}
                      <div className="mt-2 flex items-center justify-between">

                        <p className="text-xs text-slate-400">
                          {Math.round(
                            budgetPercentage
                          )}% used
                        </p>

                        {remaining >= 0 ? (
                          <p className="text-xs text-slate-400">
                            ₹
                            {remaining.toLocaleString(
                              "en-IN"
                            )}{" "}
                            remaining
                          </p>
                        ) : (
                          <p className="text-xs font-medium text-red-500">
                            ₹
                            {Math.abs(
                              remaining
                            ).toLocaleString(
                              "en-IN"
                            )}{" "}
                            over
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* No Budget */
                    <p className="mt-3 text-xs text-slate-400">
                      No budget set
                    </p>
                  )}
                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* ==================== SCROLL HINT ==================== */}

      {ranking.length > 4 && (
        <p className="mt-4 text-center text-xs text-slate-400">
          Scroll to view more
        </p>
      )}

      {/* ==================== SCROLLBAR ==================== */}

      <style>
        {`
          .ranking-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }

          .ranking-scroll::-webkit-scrollbar {
            width: 5px;
          }

          .ranking-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .ranking-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          .ranking-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  );
}

export default ExpenseRanking;