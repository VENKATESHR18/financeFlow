import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

function Savings() {
  const {
    savingsGoals,
    addSavingsGoal,
    addSavings,
    deleteSavingsGoal,
  } = useFinance();

  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
  });

  const [activeGoalId, setActiveGoalId] = useState(null);
  const [savingAmount, setSavingAmount] = useState("");

  // Delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [goalToDelete, setGoalToDelete] =
    useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.targetAmount ||
      !formData.targetDate
    ) {
      return;
    }

    if (Number(formData.targetAmount) <= 0) {
      return;
    }

    addSavingsGoal({
      name: formData.name.trim(),
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount) || 0,
      targetDate: formData.targetDate,
    });

    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      targetDate: "",
    });
  };

  // Open Add Money form
  const handleOpenAddMoney = (id) => {
    setActiveGoalId(id);
    setSavingAmount("");
  };

  // Cancel Add Money
  const handleCancelAddMoney = () => {
    setActiveGoalId(null);
    setSavingAmount("");
  };

  // Add money to selected goal
  const handleAddMoney = (id) => {
    const amount = Number(savingAmount);

    if (!amount || amount <= 0) {
      return;
    }

    addSavings(id, amount);

    setSavingAmount("");
    setActiveGoalId(null);
  };

  // Open delete confirmation
  const handleDeleteGoal = (goal) => {
    setGoalToDelete(goal);
    setShowDeleteConfirm(true);
  };

  // Close delete confirmation
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setGoalToDelete(null);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!goalToDelete) {
      return;
    }

    deleteSavingsGoal(goalToDelete.id);

    setShowDeleteConfirm(false);
    setGoalToDelete(null);
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Planning
        </p>

        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Savings
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Set savings goals and track your progress over time.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid items-stretch gap-6 lg:grid-cols-5">
        {/* CREATE SAVINGS GOAL */}
        <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="mb-6">
            <p className="text-sm font-medium text-emerald-600">
              New Goal
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Create Savings Goal
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Define a target and start tracking your progress.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Goal Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Goal Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. New Laptop"
                className={inputStyle}
                required
              />
            </div>

            {/* Target Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Target Amount
              </label>

              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="e.g. 50000"
                min="1"
                className={inputStyle}
                required
              />
            </div>

            {/* Current Savings */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Savings
              </label>

              <input
                type="number"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleChange}
                placeholder="e.g. 10000"
                min="0"
                className={inputStyle}
              />
            </div>

            {/* Target Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Target Date
              </label>

              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            {/* Create Goal */}
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            >
              Create Goal
            </button>
          </form>
        </section>

        {/* SAVINGS GOALS */}
        <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-3">
          <div className="mb-6">
            <p className="text-sm font-medium text-emerald-600">
              Your Goals
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Savings Progress
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Track how close you are to reaching each goal.
            </p>
          </div>

          {/* No Goals */}
          {savingsGoals.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-slate-50 p-6 text-center">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  No savings goals yet.
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Create your first goal to start tracking your savings.
                </p>
              </div>
            </div>
          ) : (
            <div className="savings-scroll max-h-[400px] space-y-4 overflow-y-auto pr-2">
              {[...savingsGoals].reverse().map((goal) => {
                const target = Number(goal.targetAmount);
                const current = Number(goal.currentAmount);

                const progress =
                  target > 0
                    ? Math.min((current / target) * 100, 100)
                    : 0;

                const remaining = Math.max(
                  target - current,
                  0
                );

                const isAddingMoney =
                  activeGoalId === goal.id;

                return (
                  <div
                    key={goal.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                  >
                    {/* Goal Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {goal.name}
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          Target date:{" "}
                          {new Date(
                            goal.targetDate
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteGoal(goal)
                        }
                        className="rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Amounts */}
                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-500">
                          Saved
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-900">
                          ₹{current.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          Target
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          ₹{target.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                      <div className="mt-2 flex justify-between text-xs">
                        <span className="font-medium text-emerald-600">
                          {Math.round(progress)}% completed
                        </span>

                        <span className="text-slate-500">
                          ₹{remaining.toLocaleString("en-IN")} remaining
                        </span>
                      </div>
                    </div>

                    {/* Completed */}
                    {current >= target ? (
                      <div className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        Goal completed!
                      </div>
                    ) : (
                      <>
                        {/* Add Money Button */}
                        {!isAddingMoney && (
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenAddMoney(goal.id)
                            }
                            className="mt-5 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
                          >
                            + Add Money
                          </button>
                        )}

                        {/* Add Money Form */}
                        {isAddingMoney && (
                          <div className="mt-5 rounded-xl border border-emerald-100 bg-white p-4">
                            <p className="mb-3 text-sm font-medium text-slate-700">
                              Add money to this goal
                            </p>

                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="1"
                                value={savingAmount}
                                onChange={(e) =>
                                  setSavingAmount(
                                    e.target.value
                                  )
                                }
                                placeholder="Enter amount"
                                autoFocus
                                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition duration-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  handleAddMoney(goal.id)
                                }
                                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
                              >
                                Add Money
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={
                                handleCancelAddMoney
                              }
                              className="mt-2 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition-all duration-200 hover:bg-slate-50 hover:text-slate-600 active:scale-[0.98]"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            {/* Warning Content */}
            <div>
              <p className="text-sm font-semibold text-red-600">
                Warning
              </p>

              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Delete this savings goal?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {goalToDelete?.name
                  ? `"${goalToDelete.name}" will be permanently removed. This action cannot be undone.`
                  : "This savings goal will be permanently removed. This action cannot be undone."}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
              >
                Delete Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Savings Scrollbar */}
      <style>
        {`
          .savings-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }

          .savings-scroll::-webkit-scrollbar {
            width: 5px;
          }

          .savings-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .savings-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          .savings-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  );
}

export default Savings;