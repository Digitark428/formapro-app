import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, trend, accent = "#0FA980", sub }) {
  const up = trend >= 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ink/8 bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-card">
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150"
        style={{ backgroundColor: accent }}
      />
      <div className="relative flex items-start justify-between">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          <Icon size={19} />
        </span>
        {typeof trend === "number" && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              up ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-600"
            }`}
          >
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="relative mt-4">
        <div className="font-display text-3xl font-bold text-ink">{value}</div>
        <div className="mt-1 text-sm text-ink-muted">{label}</div>
        {sub && <div className="mt-0.5 text-xs text-ink/40">{sub}</div>}
      </div>
    </div>
  );
}
