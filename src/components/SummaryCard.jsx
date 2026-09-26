function SummaryCard({ title, amount, description, positive = false }) {
  return (
    <div
      className="group rounded-2xl border border-slate-200 bg-white p-6
                 transition-all duration-300
                 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
    >
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h3
        className={`mt-3 text-2xl font-bold tracking-tight ${
          positive ? "text-emerald-600" : "text-slate-900"
        }`}
      >
        ₹{amount.toLocaleString("en-IN")}
      </h3>

      <p className="mt-2 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default SummaryCard;