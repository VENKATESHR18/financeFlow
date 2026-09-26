import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

function Settings() {
  const { resetAllData } = useFinance();

  const [showResetModal, setShowResetModal] = useState(false);

  const handleReset = () => {
    resetAllData();
    setShowResetModal(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Preferences
        </p>

        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Manage your FinanceFlow preferences and data.
        </p>
      </div>

      {/* Data Management */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Data Management
          </p>

          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            Manage Your Data
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Manage the financial data stored in this application.
          </p>
        </div>

        {/* Reset Data */}
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-red-100 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Reset All Data
            </h4>

            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              Permanently remove your transactions, deleted transactions,
              and savings goals from FinanceFlow.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="shrink-0 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-red-600 hover:shadow-md"
          >
            Reset All Data
          </button>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div>
              <p className="text-sm font-medium text-red-500">
                Data Management
              </p>

              <h3 className="mt-1 text-xl font-semibold text-slate-900">
                Reset all data?
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                This action cannot be undone. All your transactions,
                recently deleted transactions, and savings goals will be
                permanently removed.
              </p>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 hover:shadow-md"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;