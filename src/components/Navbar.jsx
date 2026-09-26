import { NavLink } from "react-router-dom";

function Navbar() {
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Add Expense", path: "/add-expense" },
    { name: "Finance", path: "/finance" },
    { name: "Savings", path: "/savings" },
    { name: "Budget", path: "/budget" },
    { name: "Bin", path: "/recently-deleted" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-4">

        {/* Logo / Brand */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            FinanceFlow
          </h1>

          <p className="text-xs text-slate-500">
            Personal Finance
          </p>
        </div>

        {/* Navigation */}
        <div className="ml-auto flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;