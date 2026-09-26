import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

function RecentlyDeleted() {
  const {
    deletedTransactions,
    restoreTransaction,
    permanentlyDelete,
    emptyBin,
  } = useFinance();

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const openConfirm = (action) => {
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction?.type === "empty") {
      emptyBin();
    }

    if (confirmAction?.type === "delete") {
      permanentlyDelete(confirmAction.id);
    }

    closeConfirm();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Recycle Bin
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Recently Deleted
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Restore transactions or permanently remove them.
          </p>
        </div>

        {deletedTransactions.length > 0 && (
          <button
            type="button"
            onClick={() =>
              openConfirm({
                type: "empty",
              })
            }
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
          >
            Empty Bin
          </button>
        )}
      </div>

      {/* Deleted Transactions */}
      {deletedTransactions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <h3 className="font-semibold text-slate-900">
            Bin is empty
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Deleted transactions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {deletedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Transaction Details */}
                <div className="min-w-0">
                  <h3 className="font-semibold capitalize text-slate-900">
                    {transaction.category}
                  </h3>

                  {transaction.description && (
                    <p className="mt-1 text-sm text-slate-500">
                      {transaction.description}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-400">
                    {transaction.date}
                  </p>
                </div>

                {/* Amount + Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-slate-700">
                    ₹
                    {Number(transaction.amount).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      restoreTransaction(transaction.id)
                    }
                    className="rounded-lg bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
                  >
                    Restore
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openConfirm({
                        type: "delete",
                        id: transaction.id,
                      })
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            {/* Warning Content */}
            <div>
              <p className="text-sm font-semibold text-red-600">
                Warning
              </p>

              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {confirmAction?.type === "empty"
                  ? "Empty the recycle bin?"
                  : "Delete this transaction forever?"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {confirmAction?.type === "empty"
                  ? "All deleted transactions will be permanently removed. This action cannot be undone."
                  : "This transaction will be permanently removed and cannot be restored."}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeConfirm}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
              >
                {confirmAction?.type === "empty"
                  ? "Empty Bin"
                  : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentlyDeleted;