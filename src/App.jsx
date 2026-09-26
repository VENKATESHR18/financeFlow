import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider } from "./context/FinanceContext";
import Navbar from "./Components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Finance from "./pages/Finance";
import Savings from "./pages/Savings";
import Budget from "./pages/Budget";
import RecentlyDeleted from "./pages/RecentlyDeleted";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <FinanceProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Navbar />

          <main className="mx-auto max-w-7xl px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route
                path="/add-expense"
                element={<AddExpense />}
              />

              <Route
                path="/finance"
                element={<Finance />}
              />

              <Route
                path="/savings"
                element={<Savings />}
              />

              <Route
                path="/budget"
                element={<Budget />}
              />

              <Route
                path="/recently-deleted"
                element={<RecentlyDeleted />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />
            </Routes>
          </main>
        </div>
      </FinanceProvider>
    </BrowserRouter>
  );
}

export default App;