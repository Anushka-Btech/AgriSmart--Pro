import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";
import { useCropData, useWeatherData } from "../hooks/useAppHooks";
import StatCard from "../components/ui/StatCard";
import { SkeletonCard, SkeletonChart } from "../components/ui/Skeleton";
import { formatCurrency, getChangeBg } from "../utils/helpers";

const PIE_COLORS = ["#15803d", "#d97706", "#0284c7", "#7c3aed"];

export default function Dashboard() {
  const { list, summary, status } = useCropData();
  const { data: weather, status: wStatus } = useWeatherData();
  const savedCount = useSelector((s) => s.savedRecords.records.length);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    list.forEach((c) => { map[c.category] = (map[c.category] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [list]);

  const topMovers = useMemo(() => {
    return [...list].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)).slice(0, 5);
  }, [list]);

  const currentWeather = weather?.current_weather;
  const temp = currentWeather?.temperature;
  const windspeed = currentWeather?.windspeed;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {status === "loading" ? (
          [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Tracked Crops"
              value={list.length}
              subtitle={`${summary?.totalCrops || "—"} crops in market`}
              icon="🌾"
              accent="green"
            />
            <StatCard
              title="Avg Market Change"
              value={summary?.avgChangeToday || "—"}
              subtitle="compared to yesterday"
              icon="📊"
              accent="amber"
            />
            <StatCard
              title="Temperature"
              value={wStatus === "succeeded" ? `${temp}°C` : "—"}
              subtitle={`Wind: ${windspeed || "—"} km/h`}
              icon="🌡️"
              accent="sky"
            />
            <StatCard
              title="Saved Records"
              value={savedCount}
              subtitle="crop entries saved"
              icon="📋"
              accent="red"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Price trend chart */}
        <div className="lg:col-span-2">
          {status === "loading" ? (
            <SkeletonChart />
          ) : (
            <div className="stat-card">
              <h3 className="font-display font-semibold text-stone-700 text-base mb-4">
                Monthly Price Trends — Key Crops
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={summary?.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#78716c" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#78716c" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }}
                    formatter={(v) => [`₹${v}`, ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="wheat" stroke="#15803d" strokeWidth={2} dot={false} name="Wheat" />
                  <Line type="monotone" dataKey="rice" stroke="#0284c7" strokeWidth={2} dot={false} name="Rice" />
                  <Line type="monotone" dataKey="cotton" stroke="#d97706" strokeWidth={2} dot={false} name="Cotton" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div>
          {status === "loading" ? (
            <SkeletonChart />
          ) : (
            <div className="stat-card h-full">
              <h3 className="font-display font-semibold text-stone-700 text-base mb-4">
                Crop Categories
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">
                    {categoryBreakdown.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {categoryBreakdown.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-xs text-stone-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % 4] }} />
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Movers & Bar Chart */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top movers table */}
        <div className="stat-card">
          <h3 className="font-display font-semibold text-stone-700 text-base mb-4">Top Price Movers Today</h3>
          {status === "loading" ? (
            <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-10" />)}</div>
          ) : (
            <div className="space-y-2">
              {topMovers.map((crop) => (
                <div key={crop.id} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-stone-700">{crop.name}</p>
                    <p className="text-xs text-stone-400">{crop.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-mono text-stone-700">{formatCurrency(crop.currentPrice)}</p>
                    <span className={`badge text-xs ${getChangeBg(crop.changePct)}`}>
                      {crop.changePct >= 0 ? "+" : ""}{crop.changePct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bar chart top prices */}
        <div className="stat-card">
          <h3 className="font-display font-semibold text-stone-700 text-base mb-4">MSP vs Current Price</h3>
          {status === "loading" ? (
            <div className="skeleton h-48" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={list.slice(0, 6)} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#78716c" }} />
                <YAxis tick={{ fontSize: 10, fill: "#78716c" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontSize: 12 }}
                  formatter={(v) => [`₹${v}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="msp" fill="#86efac" name="MSP" radius={[4, 4, 0, 0]} />
                <Bar dataKey="currentPrice" fill="#15803d" name="Current" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
