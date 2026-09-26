import { useFinance } from "../context/FinanceContext";

function RecentTransactions({
  transactions,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  dateFilter,
  setDateFilter,
  customDate,
  setCustomDate,
}) {
  const {
    editTransaction,
    deleteTransaction,
  } = useFinance();

  const recentTransactions = [...transactions]
    .sort((a, b) => b.id - a.id)
    .slice(0, 10);

  // Handle date filter
  const handleDateFilterChange = (value) => {
    setDateFilter(value);

    // Clear custom date when another filter is selected
    if (value !== "custom") {
      setCustomDate("");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">

      {/* HEADER */}

      <div className="mb-6">
        <p className="text-sm font-medium text-emerald-600">
          Activity
        </p>

        <h3 className="mt-1 text-xl font-semibold text-slate-900">
          Recent Transactions
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Search and manage your transactions.
        </p>
      </div>

      {/* SEARCH */}

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search transactions..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* FILTERS */}

      <div className="mb-6 flex flex-wrap items-center gap-2">

        {/* ALL */}

        <button
          type="button"
          onClick={() => setTypeFilter("all")}
          className={`h-[38px] rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
            typeFilter === "all"
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "border border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
          }`}
        >
          All
        </button>

        {/* INCOME */}

        <button
          type="button"
          onClick={() => setTypeFilter("income")}
          className={`h-[38px] rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
            typeFilter === "income"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "border border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
          }`}
        >
          Income
        </button>

        {/* EXPENSE */}

        <button
          type="button"
          onClick={() => setTypeFilter("expense")}
          className={`h-[38px] rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
            typeFilter === "expense"
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "border border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
          }`}
        >
          Expense
        </button>

        {/* CATEGORY */}

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-[38px] w-[145px] shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        >
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="shopping">Shopping</option>
          <option value="bills">Bills</option>
          <option value="education">Education</option>
          <option value="entertainment">Entertainment</option>
          <option value="salary">Salary</option>
          <option value="other">Other</option>
        </select>

        {/* DATE */}

        <select
          value={dateFilter}
          onChange={(e) =>
            handleDateFilterChange(e.target.value)
          }
          className="h-[38px] w-[135px] shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="custom">Custom Date</option>
        </select>

        {/* CUSTOM DATE */}

        {dateFilter === "custom" && (
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="h-[38px] w-[150px] shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        )}

      </div>

      {/* TRANSACTIONS */}

      {recentTransactions.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-xl bg-slate-50">
          <p className="text-sm text-slate-400">
            No matching transactions.
          </p>
        </div>
      ) : (
        <>
          <div
            className="recent-transactions-scroll overflow-y-auto pr-2"
            style={{ height: "360px" }}
          >
            <div className="space-y-3">

              {recentTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={() =>
                    editTransaction(transaction)
                  }
                  onDelete={() =>
                    deleteTransaction(transaction.id)
                  }
                />
              ))}

            </div>
          </div>

          {/* SCROLL MESSAGE */}

          {recentTransactions.length > 5 && (
            <p className="mt-4 text-center text-xs text-slate-400">
              Scroll to view more
            </p>
          )}
        </>
      )}

      {/* CUSTOM SCROLLBAR */}

      <style>
        {`
          .recent-transactions-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }

          .recent-transactions-scroll::-webkit-scrollbar {
            width: 5px;
          }

          .recent-transactions-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .recent-transactions-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          .recent-transactions-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>

    </section>
  );
}

function TransactionCard({
  transaction,
  onEdit,
  onDelete,
}) {
  return (
    <div className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-sm">

      <div className="flex items-center justify-between gap-4">

        {/* TRANSACTION INFORMATION */}

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            {/* CATEGORY LETTER */}

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                transaction.type === "income"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {transaction.category.charAt(0).toUpperCase()}
            </div>

            {/* CATEGORY + DESCRIPTION */}

            <div>
              <h4 className="font-medium capitalize text-slate-900">
                {transaction.category}
              </h4>

              {transaction.description && (
                <p className="truncate text-xs text-slate-500">
                  {transaction.description}
                </p>
              )}
            </div>

          </div>

          {/* DATE */}

          <p className="mt-2 text-xs text-slate-400">
            {transaction.date}
          </p>

        </div>

        {/* AMOUNT + ACTIONS */}

        <div className="flex shrink-0 items-center gap-4">

          {/* AMOUNT */}

          <span
            className={`font-semibold ${
              transaction.type === "income"
                ? "text-emerald-600"
                : "text-slate-900"
            }`}
          >
            {transaction.type === "income" ? "+" : "-"}₹
            {Number(transaction.amount).toLocaleString("en-IN")}
          </span>

          {/* ACTION BUTTONS */}

          <div className="flex gap-2 opacity-0 transition group-hover:opacity-100">

            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RecentTransactions;