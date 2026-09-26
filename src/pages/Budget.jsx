import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

function Budget() {
  const {
    budgets,
    transactions,
    addBudget,
    updateBudget,
    deleteBudget,
  } = useFinance();

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
  });

  const [errors, setErrors] = useState({});

  const [editingBudgetId, setEditingBudgetId] =
    useState(null);

  const [editingAmount, setEditingAmount] =
    useState("");

  const [editingError, setEditingError] =
    useState("");

  const categories = [
    "food",
    "transport",
    "shopping",
    "bills",
    "education",
    "entertainment",
    "other",
  ];

  // ==================== FORM CHANGE ====================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  // ==================== CATEGORY CHANGE ====================

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    const existingBudget = budgets.find(
      (budget) =>
        budget.category === selectedCategory
    );

    if (existingBudget) {
      setFormData({
        category: selectedCategory,
        amount: existingBudget.amount,
      });
    } else {
      setFormData({
        category: selectedCategory,
        amount: "",
      });
    }

    setErrors({});
  };

  // ==================== CREATE / UPDATE ====================

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.category) {
      newErrors.category =
        "Please select a category.";
    }

    if (!formData.amount) {
      newErrors.amount =
        "Please enter a budget amount.";
    } else if (
      Number(formData.amount) <= 0
    ) {
      newErrors.amount =
        "Budget amount must be greater than ₹0.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const existingBudget = budgets.find(
      (budget) =>
        budget.category === formData.category
    );

    if (existingBudget) {
      updateBudget(
        existingBudget.id,
        formData.amount
      );
    } else {
      addBudget(formData);
    }

    setFormData({
      category: "",
      amount: "",
    });

    setErrors({});
  };

  // ==================== EDIT BUDGET ====================

  const handleEditStart = (budget) => {
    setEditingBudgetId(budget.id);
    setEditingAmount(budget.amount);
    setEditingError("");
  };

  // ==================== CANCEL EDIT ====================

  const handleEditCancel = () => {
    setEditingBudgetId(null);
    setEditingAmount("");
    setEditingError("");
  };

  // ==================== SAVE EDIT ====================

  const handleEditSave = (id) => {
    if (!editingAmount) {
      setEditingError(
        "Please enter a budget amount."
      );
      return;
    }

    if (Number(editingAmount) <= 0) {
      setEditingError(
        "Budget amount must be greater than ₹0."
      );
      return;
    }

    updateBudget(id, editingAmount);

    setEditingBudgetId(null);
    setEditingAmount("");
    setEditingError("");
  };

  // ==================== CURRENT MONTH ====================

  const currentDate = new Date();

  const currentMonth =
    currentDate.getMonth();

  const currentYear =
    currentDate.getFullYear();

  // ==================== CATEGORY SPENDING ====================

  const getCategorySpending = (category) => {
    return transactions
      .filter((transaction) => {
        if (
          transaction.type !== "expense"
        ) {
          return false;
        }

        const transactionDate =
          new Date(transaction.date);

        if (
          isNaN(
            transactionDate.getTime()
          )
        ) {
          return false;
        }

        return (
          transaction.category === category &&
          transactionDate.getMonth() ===
            currentMonth &&
          transactionDate.getFullYear() ===
            currentYear
        );
      })
      .reduce(
        (total, transaction) => {
          return (
            total +
            Number(transaction.amount)
          );
        },
        0
      );
  };

  // ==================== SUMMARY ====================

  const totalBudget = budgets.reduce(
    (total, budget) => {
      return (
        total +
        Number(budget.amount)
      );
    },
    0
  );

  const totalSpent = budgets.reduce(
    (total, budget) => {
      return (
        total +
        getCategorySpending(
          budget.category
        )
      );
    },
    0
  );

  const totalRemaining =
    totalBudget - totalSpent;

  const overallPercentage =
    totalBudget > 0
      ? (totalSpent / totalBudget) * 100
      : 0;

  // ==================== STYLES ====================

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  const selectStyle =
    "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition duration-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  const errorStyle =
    "mt-1.5 text-xs text-red-500";

  const selectedCategoryHasBudget =
    budgets.some(
      (budget) =>
        budget.category ===
        formData.category
    );

  return (
    <div className="animate-fade-up">

      {/* ==================== PAGE HEADER ==================== */}

      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Planning
        </p>

        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Budget
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Set spending limits and keep your
          expenses under control.
        </p>
      </div>

      {/* ==================== MAIN LAYOUT ==================== */}

      <div className="grid items-stretch gap-6 lg:grid-cols-5">

        {/* ==================== LEFT SIDE ==================== */}

        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* ==================== BUDGET FORM ==================== */}

          <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">

            <div>
              <p className="text-sm font-medium text-emerald-600">
                Budget Setup
              </p>

              <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                {selectedCategoryHasBudget
                  ? "Update Budget"
                  : "Create Budget"}
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {selectedCategoryHasBudget
                  ? "Update the monthly limit for this category."
                  : "Set a monthly spending limit for a category."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* CATEGORY */}

              <div>
                <label
                  htmlFor="budget-category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>

                <div className="relative">

                  <select
                    id="budget-category"
                    name="category"
                    value={formData.category}
                    onChange={
                      handleCategoryChange
                    }
                    required
                    className={`${selectStyle} ${
                      errors.category
                        ? "border-red-300"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category
                            .charAt(0)
                            .toUpperCase() +
                            category.slice(1)}
                        </option>
                      )
                    )}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    ▼
                  </span>

                </div>

                {errors.category && (
                  <p className={errorStyle}>
                    {errors.category}
                  </p>
                )}
              </div>

              {/* AMOUNT */}

              <div>
                <label
                  htmlFor="budget-amount"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Monthly Budget
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                    ₹
                  </span>

                  <input
                    id="budget-amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="5000"
                    min="1"
                    required
                    className={`${inputStyle} pl-9 ${
                      errors.amount
                        ? "border-red-300"
                        : ""
                    }`}
                  />

                </div>

                {errors.amount && (
                  <p className={errorStyle}>
                    {errors.amount}
                  </p>
                )}
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
              >
                {selectedCategoryHasBudget
                  ? "Update Budget"
                  : "Create Budget"}
              </button>

            </form>
          </section>

          {/* ==================== BUDGET SUMMARY ==================== */}

          {budgets.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6">

              <div>
                <p className="text-sm font-medium text-emerald-600">
                  Overview
                </p>

                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                  Budget Summary
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your current month's budget activity.
                </p>
              </div>

              <div className="mt-6 space-y-5">

                {/* TOTAL BUDGET */}

                <div>
                  <p className="text-sm text-slate-500">
                    Total Budget
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    ₹
                    {totalBudget.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                {/* TOTAL SPENT */}

                <div className="flex items-end justify-between">

                  <div>
                    <p className="text-sm text-slate-500">
                      Total Spent
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      ₹
                      {totalSpent.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <p className="text-sm font-medium text-slate-400">
                    {Math.round(
                      overallPercentage
                    )}
                    %
                  </p>

                </div>

                {/* OVERALL PROGRESS */}

                <div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        overallPercentage >= 100
                          ? "bg-red-500"
                          : overallPercentage >= 80
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          overallPercentage,
                          100
                        )}%`,
                      }}
                    />

                  </div>
                </div>

                {/* REMAINING */}

                <div className="border-t border-slate-100 pt-5">

                  <p className="text-sm text-slate-500">
                    {totalRemaining >= 0
                      ? "Remaining"
                      : "Over Budget"}
                  </p>

                  <p
                    className={`mt-1 text-xl font-bold ${
                      totalRemaining >= 0
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    ₹
                    {Math.abs(
                      totalRemaining
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </div>
            </section>
          )}
        </div>

        {/* ==================== RIGHT SIDE ==================== */}

        <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-3">

          <div>
            <p className="text-sm font-medium text-emerald-600">
              Overview
            </p>

            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              Your Budgets
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Track your monthly spending limits.
            </p>
          </div>

          {/* EMPTY STATE */}

          {budgets.length === 0 ? (
            <div className="mt-6 flex flex-1 items-center justify-center rounded-xl bg-slate-50 p-6 text-center">

              <div>
                <p className="text-sm font-medium text-slate-600">
                  No budgets created yet.
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Create your first category budget
                  to start tracking.
                </p>
              </div>

            </div>
          ) : (

            <div
              className="budget-list-scroll mt-6 flex-1 space-y-4 overflow-y-auto pr-2"
              style={{
                maxHeight: "650px",
              }}
            >

              {budgets.map((budget) => {

                const spent =
                  getCategorySpending(
                    budget.category
                  );

                const budgetAmount =
                  Number(budget.amount);

                const percentage =
                  budgetAmount > 0
                    ? (spent /
                        budgetAmount) *
                      100
                    : 0;

                const progressWidth =
                  Math.min(
                    percentage,
                    100
                  );

                const remaining =
                  budgetAmount - spent;

                let statusText =
                  "On track";

                let statusClass =
                  "bg-emerald-50 text-emerald-600";

                if (percentage >= 100) {
                  statusText =
                    "Budget exceeded";

                  statusClass =
                    "bg-red-50 text-red-600";
                } else if (
                  percentage >= 80
                ) {
                  statusText =
                    "Almost reached";

                  statusClass =
                    "bg-amber-50 text-amber-600";
                }

                const isEditing =
                  editingBudgetId ===
                  budget.id;

                return (
                  <div
                    key={budget.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                  >

                    {/* BUDGET HEADER */}

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="font-semibold capitalize text-slate-800">
                          {budget.category}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Monthly budget
                        </p>
                      </div>

                      {!isEditing && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
                        >
                          {statusText}
                        </span>
                      )}

                    </div>

                    {/* EDIT MODE */}

                    {isEditing ? (
                      <div className="mt-5">

                        <label className="mb-2 block text-xs font-medium text-slate-500">
                          New Budget Amount
                        </label>

                        <div className="relative">

                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                            ₹
                          </span>

                          <input
                            type="number"
                            min="1"
                            value={editingAmount}
                            onChange={(e) => {
                              setEditingAmount(
                                e.target.value
                              );
                              setEditingError("");
                            }}
                            className={`${inputStyle} pl-9 ${
                              editingError
                                ? "border-red-300"
                                : ""
                            }`}
                          />

                        </div>

                        {editingError && (
                          <p className={errorStyle}>
                            {editingError}
                          </p>
                        )}

                        <div className="mt-3 flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditSave(
                                budget.id
                              )
                            }
                            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={
                              handleEditCancel
                            }
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
                          >
                            Cancel
                          </button>

                        </div>

                      </div>
                    ) : (

                      <>
                        {/* AMOUNTS */}

                        <div className="mt-5 flex items-end justify-between">

                          <div>
                            <p className="text-xs text-slate-400">
                              Spent
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                              ₹
                              {spent.toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>

                          <div className="text-right">

                            <p className="text-xs text-slate-400">
                              Budget
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              ₹
                              {budgetAmount.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                        </div>

                        {/* PROGRESS */}

                        <div className="mt-4">

                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                percentage >= 100
                                  ? "bg-red-500"
                                  : percentage >= 80
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{
                                width: `${progressWidth}%`,
                              }}
                            />

                          </div>

                        </div>

                        {/* BOTTOM */}

                        <div className="mt-3 flex items-center justify-between">

                          <p className="text-xs font-medium text-slate-500">
                            {Math.round(
                              percentage
                            )}
                            % used
                          </p>

                          {remaining >=
                          0 ? (
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
                              over budget
                            </p>
                          )}

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-4 flex items-center justify-end gap-4 border-t border-slate-200 pt-3">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditStart(
                                budget
                              )
                            }
                            className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteBudget(
                                budget.id
                              )
                            }
                            className="rounded-lg px-3 py-2 text-xs font-medium text-red-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
                          >
                            Delete
                          </button>

                        </div>
                      </>
                    )}

                  </div>
                );
              })}

            </div>
          )}
        </section>
      </div>

      {/* ==================== SCROLLBAR ==================== */}

      <style>
        {`
          .budget-list-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }

          .budget-list-scroll::-webkit-scrollbar {
            width: 5px;
          }

          .budget-list-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .budget-list-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          .budget-list-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  );
}

export default Budget;