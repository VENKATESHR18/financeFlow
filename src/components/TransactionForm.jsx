import { useEffect, useState } from "react";
import { useFinance } from "../context/FinanceContext";

function TransactionForm() {
  const {
    addTransaction,
    updateTransaction,
    editingTransaction,
    setEditingTransaction,
  } = useFinance();

  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [errors, setErrors] = useState({});

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type || "",
        amount: editingTransaction.amount || "",
        category: editingTransaction.category || "",
        description: editingTransaction.description || "",
        date: editingTransaction.date || "",
      });

      setErrors({});
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Remove error when user fixes the field
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = "Please select a transaction type.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (!formData.amount) {
      newErrors.amount = "Please enter an amount.";
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than ₹0.";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date.";
    } else if (formData.date > today) {
      newErrors.date = "Future dates are not allowed.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please enter a description.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingTransaction) {
      updateTransaction({
        ...formData,
        id: editingTransaction.id,
        amount: Number(formData.amount),
      });
    } else {
      addTransaction({
        ...formData,
        amount: Number(formData.amount),
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: "",
      amount: "",
      category: "",
      description: "",
      date: "",
    });

    setErrors({});
    setEditingTransaction(null);
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  const selectStyle =
    "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition duration-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  const errorStyle = "mt-1.5 text-xs text-red-500";

  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-6">
      <div>
        <p className="text-sm font-medium text-emerald-600">
          Transaction
        </p>

        <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
          {editingTransaction
            ? "Edit Transaction"
            : "Add Transaction"}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {editingTransaction
            ? "Update your transaction details."
            : "Record your income or expenses."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        {/* Transaction Type */}
        <div>
          <label
            htmlFor="transaction-type"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Transaction Type
          </label>

          <div className="relative">
            <select
              id="transaction-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`${selectStyle} ${
                errors.type ? "border-red-300" : ""
              }`}
            >
              <option value="" disabled>
                Select transaction type
              </option>

              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              ▼
            </span>
          </div>

          {errors.type && (
            <p className={errorStyle}>{errors.type}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="transaction-category"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <div className="relative">
            <select
              id="transaction-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${selectStyle} ${
                errors.category ? "border-red-300" : ""
              }`}
            >
              <option value="" disabled>
                Select category
              </option>

              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="shopping">Shopping</option>
              <option value="bills">Bills</option>
              <option value="education">Education</option>
              <option value="entertainment">
                Entertainment
              </option>
              <option value="salary">Salary</option>
              <option value="other">Other</option>
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              ▼
            </span>
          </div>

          {errors.category && (
            <p className={errorStyle}>{errors.category}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="transaction-amount"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Amount
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
              ₹
            </span>

            <input
              id="transaction-amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              min="1"
              className={`${inputStyle} pl-9 ${
                errors.amount ? "border-red-300" : ""
              }`}
            />
          </div>

          {errors.amount && (
            <p className={errorStyle}>{errors.amount}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="transaction-date"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Date
          </label>

          <input
            id="transaction-date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={today}
            className={`${inputStyle} ${
              errors.date ? "border-red-300" : ""
            }`}
          />

          {errors.date ? (
            <p className={errorStyle}>{errors.date}</p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-400">
              Future dates are not allowed.
            </p>
          )}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label
            htmlFor="transaction-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <input
            id="transaction-description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What was this transaction for?"
            className={`${inputStyle} ${
              errors.description ? "border-red-300" : ""
            }`}
          />

          {errors.description && (
            <p className={errorStyle}>
              {errors.description}
            </p>
          )}
        </div>

        {/* Buttons */}
        {/* Buttons */}
      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
        >
          {editingTransaction
            ? "Update Transaction"
            : "Add Transaction"}
        </button>

        {editingTransaction && (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
          >
            Cancel
          </button>
        )}
      </div>
      </form>
    </section>
  );
}

export default TransactionForm;