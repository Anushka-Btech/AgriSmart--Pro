export default function StatCard({ title, value, subtitle, icon, accent = "green", trend }) {
  const accents = {
    green: { bg: "bg-green-50", text: "text-green-700", iconBg: "bg-green-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", iconBg: "bg-amber-100" },
    sky:   { bg: "bg-sky-50",   text: "text-sky-700",   iconBg: "bg-sky-100" },
    red:   { bg: "bg-red-50",   text: "text-red-600",   iconBg: "bg-red-100" },
  };
  const c = accents[accent] || accents.green;

  return (
    <div className="stat-card flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0 text-xl`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-1">{title}</p>
        <p className={`text-2xl font-display font-semibold ${c.text} leading-none`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-stone-400 mt-1.5">{subtitle}</p>
        )}
        {trend !== undefined && (
          <p className={`text-xs font-medium mt-1 ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% from last week
          </p>
        )}
      </div>
    </div>
  );
}
