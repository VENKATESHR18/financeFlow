import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import ExpenseRanking from "../components/ExpenseRanking";
import RecentTransactions from "../components/RecentTransactions";
import { useFinance } from "../context/FinanceContext";

function AddExpense() {
  const { transactions } = useFinance();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Date filter
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const searchValue = searchTerm.toLowerCase().trim();

    // Search
    const matchesSearch =
      !searchValue ||
      transaction.category?.toLowerCase().includes(searchValue) ||
      transaction.type?.toLowerCase().includes(searchValue) ||
      transaction.description?.toLowerCase().includes(searchValue) ||
      String(transaction.amount).includes(searchValue);

    // Type
    const matchesType =
      typeFilter === "all" ||
      transaction.type?.toLowerCase() === typeFilter;

    // Category
    const matchesCategory =
      categoryFilter === "all" ||
      transaction.category?.toLowerCase() === categoryFilter;

    // Date
    const transactionDate = new Date(transaction.date);
    const today = new Date();

    transactionDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    let matchesDate = true;

    // Today
    if (dateFilter === "today") {
      matchesDate =
        transactionDate.getTime() === today.getTime();
    }

    // This Week
    if (dateFilter === "week") {
      const day = today.getDay();

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - day);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      matchesDate =
        transactionDate >= startOfWeek &&
        transactionDate <= endOfWeek;
    }

    // This Month
    if (dateFilter === "month") {
      matchesDate =
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear();
    }

    // Custom Date
    if (dateFilter === "custom") {
      matchesDate =
        customDate === "" ||
        transaction.date === customDate;
    }

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesDate
    );
  });

  return (
   <div className="animate-fade-up">

      {/* PAGE HEADER */}

      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Transactions
        </p>

        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Add Expense
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Add transactions and keep track of your spending.
        </p>
      </div>

      {/* FORM + EXPENSE RANKING */}

      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <TransactionForm />
        <ExpenseRanking />
      </div>

      {/* RECENT TRANSACTIONS */}

      <section className="mt-6">
        <RecentTransactions
          transactions={filteredTransactions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          customDate={customDate}
          setCustomDate={setCustomDate}
        />
      </section>

    </div>
  );
}

export default AddExpense;