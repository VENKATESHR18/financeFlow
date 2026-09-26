import { useFinance } from "../context/FinanceContext";

import SummaryCard from "../components/SummaryCard";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import ExpenseBreakdownChart from "../components/ExpenseBreakdownChart";
import MonthlySpendingChart from "../components/MonthlySpendingChart";

function Dashboard() {
  const { transactions, savingsGoals } = useFinance();

  // -----------------------------
  // Calculate total income
  // -----------------------------
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => {
      return total + Number(transaction.amount);
    }, 0);

  // -----------------------------
  // Calculate total expenses
  // -----------------------------
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => {
      return total + Number(transaction.amount);
    }, 0);

  // -----------------------------
  // Calculate total savings
  // -----------------------------
  const totalSavings = savingsGoals.reduce((total, goal) => {
    return total + Number(goal.currentAmount);
  }, 0);

  // -----------------------------
  // Available income
  // -----------------------------
  const availableIncome = totalIncome - totalSavings;

  // -----------------------------
  // Total balance
  // -----------------------------
  const totalBalance = availableIncome - totalExpenses;

  return (
    <div className="animate-fade-up">
      {/* --------------------------------
          Dashboard Header
      -------------------------------- */}
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Overview
        </p>

        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Your Finances
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Keep track of your financial activity and spending.
        </p>
      </div>

      {/* --------------------------------
          Summary Cards
      -------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          amount={totalBalance}
          description="After expenses and savings"
          positive={totalBalance >= 0}
        />

        <SummaryCard
          title="Available Income"
          amount={availableIncome}
          description="Income after savings"
          positive={availableIncome >= 0}
        />

        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          description="Money spent"
        />

        <SummaryCard
          title="Savings"
          amount={totalSavings}
          description="Money set aside"
          positive
        />
      </div>

      {/* --------------------------------
          Main Analytics
      -------------------------------- */}
      <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-5">

        {/* Income vs Expenses */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-3">
          <div className="mb-6">
            <p className="text-sm font-medium text-emerald-600">
              Overview
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Income vs Expenses
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Compare your total income and spending.
            </p>
          </div>

          <IncomeExpenseChart />
        </section>

        {/* Spending Breakdown */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="mb-6">
            <p className="text-sm font-medium text-emerald-600">
              Analysis
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Spending Breakdown
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              See where your money is going.
            </p>
          </div>

          <ExpenseBreakdownChart />
        </section>
      </div>

      {/* --------------------------------
          Monthly Spending
      -------------------------------- */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-emerald-600">
            Trends
          </p>

          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            Monthly Spending
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Track how your expenses change throughout the year.
          </p>
        </div>

        <MonthlySpendingChart />
      </section>
    </div>
  );
}

export default Dashboard;