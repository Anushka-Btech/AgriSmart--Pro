import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCropData } from "../hooks/useAppHooks";
import { setSearchQuery, setFilterCategory, selectPaginatedCrops, selectFilteredCrops } from "../redux/cropSlice";
import { formatCurrency, getChangeBg, getCategoryColor, getSeasonColor, CROP_CATEGORIES } from "../utils/helpers";
import Pagination from "../components/ui/Pagination";
import { SkeletonRow } from "../components/ui/Skeleton";
import {
  LineChart, Line, Tooltip, ResponsiveContainer,
} from "recharts";

export default function Market() {
  const dispatch = useDispatch();
  const { status, error, refresh } = useCropData();
  const paginatedCrops = useSelector(selectPaginatedCrops);
  const filteredCrops = useSelector(selectFilteredCrops);
  const { searchQuery, filterCategory } = useSelector((s) => s.crops);

  const handleSearch = useCallback((e) => {
    dispatch(setSearchQuery(e.target.value));
  }, [dispatch]);

  const handleCategory = useCallback((cat) => {
    dispatch(setFilterCategory(cat));
  }, [dispatch]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <p className="text-stone-500 text-sm mt-0.5">{filteredCrops.length} crops found</p>
        </div>
        <button onClick={refresh} className="btn-secondary flex items-center gap-2 self-start sm:self-auto" disabled={status === "loading"}>
          <span className={status === "loading" ? "animate-spin inline-block" : ""}>↻</span>
          Refresh Prices
        </button>
      </div>

      {/* Search + Filter */}
      <div className="stat-card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search crops..."
              value={searchQuery}
              onChange={handleSearch}
              className="input-field pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CROP_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  filterCategory === cat
                    ? "bg-green-700 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm flex items-center gap-2">
          <span>⚠️</span> Failed to load: {error}
        </div>
      )}

      {/* Table */}
      <div className="stat-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                {["Crop", "Category", "Season", "MSP (₹)", "Current Price", "Change", "7-Day Trend"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {status === "loading" ? (
                [1,2,3,4,5,6,7,8].map((i) => <SkeletonRow key={i} />)
              ) : paginatedCrops.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400 text-sm">
                    No crops match your search.
                  </td>
                </tr>
              ) : (
                paginatedCrops.map((crop) => (
                  <tr key={crop.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-800">{crop.name}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getCategoryColor(crop.category)}`}>{crop.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getSeasonColor(crop.season)}`}>{crop.season}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-stone-600">{formatCurrency(crop.msp)}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-stone-800">{formatCurrency(crop.currentPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getChangeBg(crop.changePct)}`}>
                        {crop.changePct >= 0 ? "+" : ""}{crop.changePct}%
                      </span>
                    </td>
                    <td className="px-4 py-3 w-28">
                      <ResponsiveContainer width="100%" height={36}>
                        <LineChart data={crop.weeklyTrend}>
                          <Line type="monotone" dataKey="price" stroke={crop.changePct >= 0 ? "#15803d" : "#dc2626"} strokeWidth={1.5} dot={false} />
                          <Tooltip
                            contentStyle={{ fontSize: 10, padding: "2px 6px", borderRadius: 6 }}
                            formatter={(v) => [`₹${v}`]}
                            labelFormatter={() => ""}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-stone-100">
          <Pagination />
        </div>
      </div>
    </div>
  );
}
