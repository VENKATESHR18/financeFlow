import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const FinanceContext = createContext();

// ==================== SAFE LOCALSTORAGE ====================

const getStoredData = (key, fallback = []) => {
  try {
    const savedData = localStorage.getItem(key);

    if (!savedData) {
      return fallback;
    }

    const parsedData = JSON.parse(savedData);

    return Array.isArray(parsedData)
      ? parsedData
      : fallback;
  } catch {
    return fallback;
  }
};

// ==================== PROVIDER ====================

export function FinanceProvider({ children }) {

  // ==================== TRANSACTIONS ====================

  const [transactions, setTransactions] =
    useState(() =>
      getStoredData(
        "finance_transactions"
      )
    );

  // ==================== DELETED TRANSACTIONS ====================

  const [deletedTransactions, setDeletedTransactions] =
    useState(() =>
      getStoredData(
        "finance_deleted_transactions"
      )
    );

  // ==================== SAVINGS GOALS ====================

  const [savingsGoals, setSavingsGoals] =
    useState(() =>
      getStoredData(
        "finance_savings_goals"
      )
    );

  // ==================== BUDGETS ====================

  const [budgets, setBudgets] =
    useState(() =>
      getStoredData(
        "finance_budgets"
      )
    );

  // ==================== EDITING TRANSACTION ====================

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  // ==================== SAVE TRANSACTIONS ====================

  useEffect(() => {
    localStorage.setItem(
      "finance_transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  // ==================== SAVE DELETED TRANSACTIONS ====================

  useEffect(() => {
    localStorage.setItem(
      "finance_deleted_transactions",
      JSON.stringify(deletedTransactions)
    );
  }, [deletedTransactions]);

  // ==================== SAVE SAVINGS GOALS ====================

  useEffect(() => {
    localStorage.setItem(
      "finance_savings_goals",
      JSON.stringify(savingsGoals)
    );
  }, [savingsGoals]);

  // ==================== SAVE BUDGETS ====================

  useEffect(() => {
    localStorage.setItem(
      "finance_budgets",
      JSON.stringify(budgets)
    );
  }, [budgets]);

  // ==================== ADD TRANSACTION ====================

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      amount: Number(transaction.amount),
    };

    setTransactions(
      (previousTransactions) => [
        ...previousTransactions,
        newTransaction,
      ]
    );
  };

  // ==================== EDIT TRANSACTION ====================

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  // ==================== UPDATE TRANSACTION ====================

  const updateTransaction = (
    updatedTransaction
  ) => {
    setTransactions(
      (previousTransactions) =>
        previousTransactions.map(
          (transaction) =>
            transaction.id ===
            updatedTransaction.id
              ? {
                  ...updatedTransaction,
                  amount: Number(
                    updatedTransaction.amount
                  ),
                }
              : transaction
        )
    );

    setEditingTransaction(null);
  };

  // ==================== DELETE TRANSACTION ====================

  const deleteTransaction = (id) => {
    const transactionToDelete =
      transactions.find(
        (transaction) =>
          transaction.id === id
      );

    if (!transactionToDelete) {
      return;
    }

    setDeletedTransactions(
      (previousDeleted) => [
        ...previousDeleted,
        {
          ...transactionToDelete,
          deletedAt:
            new Date().toISOString(),
        },
      ]
    );

    setTransactions(
      (previousTransactions) =>
        previousTransactions.filter(
          (transaction) =>
            transaction.id !== id
        )
    );
  };

  // ==================== RESTORE TRANSACTION ====================

  const restoreTransaction = (id) => {
    const transactionToRestore =
      deletedTransactions.find(
        (transaction) =>
          transaction.id === id
      );

    if (!transactionToRestore) {
      return;
    }

    const {
      deletedAt,
      ...transaction
    } = transactionToRestore;

    setTransactions(
      (previousTransactions) => [
        ...previousTransactions,
        transaction,
      ]
    );

    setDeletedTransactions(
      (previousDeleted) =>
        previousDeleted.filter(
          (transaction) =>
            transaction.id !== id
        )
    );
  };

  // ==================== PERMANENT DELETE ====================

  const permanentlyDelete = (id) => {
    setDeletedTransactions(
      (previousDeleted) =>
        previousDeleted.filter(
          (transaction) =>
            transaction.id !== id
        )
    );
  };

  // ==================== EMPTY BIN ====================

  const emptyBin = () => {
    setDeletedTransactions([]);
  };

  // ==================== ADD SAVINGS GOAL ====================

  const addSavingsGoal = (goal) => {
    const newGoal = {
      id: Date.now(),
      name: goal.name,
      targetAmount: Number(
        goal.targetAmount
      ),
      currentAmount:
        Number(goal.currentAmount) || 0,
      targetDate: goal.targetDate,
    };

    setSavingsGoals(
      (previousGoals) => [
        ...previousGoals,
        newGoal,
      ]
    );
  };

  // ==================== ADD SAVINGS ====================

  const addSavings = (id, amount) => {
    const savingsAmount =
      Number(amount);

    if (
      !savingsAmount ||
      savingsAmount <= 0
    ) {
      return;
    }

    setSavingsGoals(
      (previousGoals) =>
        previousGoals.map((goal) =>
          goal.id === id
            ? {
                ...goal,
                currentAmount:
                  Math.min(
                    goal.currentAmount +
                      savingsAmount,
                    goal.targetAmount
                  ),
              }
            : goal
        )
    );
  };

  // ==================== DELETE SAVINGS GOAL ====================

  const deleteSavingsGoal = (id) => {
    setSavingsGoals(
      (previousGoals) =>
        previousGoals.filter(
          (goal) =>
            goal.id !== id
        )
    );
  };

  // ==================== ADD BUDGET ====================

  const addBudget = (budget) => {
    const budgetAmount =
      Number(budget.amount);

    setBudgets(
      (previousBudgets) => {
        const existingBudget =
          previousBudgets.find(
            (item) =>
              item.category ===
              budget.category
          );

        if (existingBudget) {
          return previousBudgets.map(
            (item) =>
              item.category ===
              budget.category
                ? {
                    ...item,
                    amount:
                      budgetAmount,
                  }
                : item
          );
        }

        const newBudget = {
          id: Date.now(),
          category: budget.category,
          amount: budgetAmount,
        };

        return [
          ...previousBudgets,
          newBudget,
        ];
      }
    );
  };

  // ==================== UPDATE BUDGET ====================

  const updateBudget = (
    id,
    amount
  ) => {
    const budgetAmount =
      Number(amount);

    setBudgets(
      (previousBudgets) =>
        previousBudgets.map(
          (budget) =>
            budget.id === id
              ? {
                  ...budget,
                  amount:
                    budgetAmount,
                }
              : budget
        )
    );
  };

  // ==================== DELETE BUDGET ====================

  const deleteBudget = (id) => {
    setBudgets(
      (previousBudgets) =>
        previousBudgets.filter(
          (budget) =>
            budget.id !== id
        )
    );
  };

  // ==================== RESET ALL DATA ====================

  const resetAllData = () => {
    setTransactions([]);
    setDeletedTransactions([]);
    setSavingsGoals([]);
    setBudgets([]);
    setEditingTransaction(null);

    localStorage.removeItem(
      "finance_transactions"
    );

    localStorage.removeItem(
      "finance_deleted_transactions"
    );

    localStorage.removeItem(
      "finance_savings_goals"
    );

    localStorage.removeItem(
      "finance_budgets"
    );

    localStorage.removeItem(
      "finance_theme"
    );
  };

  // ==================== PROVIDER ====================

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        editTransaction,
        updateTransaction,
        deleteTransaction,
        editingTransaction,
        setEditingTransaction,

        deletedTransactions,
        restoreTransaction,
        permanentlyDelete,
        emptyBin,

        savingsGoals,
        addSavingsGoal,
        addSavings,
        deleteSavingsGoal,

        budgets,
        addBudget,
        updateBudget,
        deleteBudget,

        resetAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

// ==================== CUSTOM HOOK ====================

export function useFinance() {
  return useContext(FinanceContext);
}