import { useDispatch } from "react-redux";
import { useWeatherData } from "../hooks/useAppHooks";
import { setLocation, loadWeather } from "../redux/weatherSlice";
import { AG_LOCATIONS, getWeatherDescription } from "../api/weatherApi";

const ADVISORIES = [
  {
    icon: "🌾",
    title: "Wheat Harvesting Window",
    body: "Ideal harvesting conditions expected this week. Soil moisture levels are optimal. Ensure combine harvesters are serviced before deployment.",
    type: "info",
    season: "Rabi",
  },
  {
    icon: "💧",
    title: "Irrigation Advisory",
    body: "Low precipitation probability in the next 5 days. Schedule drip irrigation for cotton and soybean fields to maintain crop health.",
    type: "warning",
    season: "Kharif",
  },
  {
    icon: "🐛",
    title: "Pest Alert — Aphids",
    body: "High humidity conditions may trigger aphid infestation in mustard crops. Apply neem-based pesticides proactively.",
    type: "alert",
    season: "Rabi",
  },
  {
    icon: "🌱",
    title: "Sowing Recommendation",
    body: "Soil temperature at 10cm depth is suitable for Kharif sowing. Begin with short-duration paddy varieties.",
    type: "info",
    season: "Kharif",
  },
];

const ADVISORY_COLORS = {
  info: { border: "border-l-sky-400", bg: "bg-sky-50", badge: "bg-sky-100 text-sky-700" },
  warning: { border: "border-l-amber-400", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  alert: { border: "border-l-red-400", bg: "bg-red-50", badge: "bg-red-100 text-red-600" },
};

const SOIL_TIPS = [
  { label: "pH Level", value: "6.2–7.0", note: "Optimal for most crops", ok: true },
  { label: "Nitrogen", value: "Medium", note: "Apply urea before sowing", ok: true },
  { label: "Phosphorus", value: "Low", note: "DAP application recommended", ok: false },
  { label: "Potassium", value: "High", note: "No supplementation needed", ok: true },
];

export default function Advisory() {
  const dispatch = useDispatch();
  const { data: weather, selectedLocation, status } = useWeatherData();

  const handleLocationChange = (e) => {
    const loc = AG_LOCATIONS.find((l) => l.name === e.target.value);
    if (loc) {
      dispatch(setLocation(loc));
      dispatch(loadWeather({ lat: loc.lat, lon: loc.lon }));
    }
  };

  const current = weather?.current_weather;
  const daily = weather?.daily;
  const hourly = weather?.hourly;

  const weeklyForecast = daily
    ? daily.time.slice(0, 7).map((date, i) => ({
        date,
        maxTemp: daily.temperature_2m_max[i],
        minTemp: daily.temperature_2m_min[i],
        rain: daily.precipitation_sum[i],
        code: daily.weathercode[i],
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Location selector */}
      <div className="stat-card flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-stone-500 font-medium mb-1">Select Agricultural Region</p>
          <select
            value={selectedLocation.name}
            onChange={handleLocationChange}
            className="input-field"
          >
            {AG_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-stone-500">
          <p className="font-medium text-stone-700">Primary Crops</p>
          <p className="text-xs mt-1">{selectedLocation.crops.join(" · ")}</p>
        </div>
      </div>

      {/* Current weather */}
      {status === "loading" && (
        <div className="stat-card flex items-center justify-center py-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-stone-500">Fetching live weather data...</p>
          </div>
        </div>
      )}

      {status === "succeeded" && current && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Temperature", value: `${current.temperature}°C`, icon: "🌡️", sub: "Current" },
            { label: "Wind Speed", value: `${current.windspeed} km/h`, icon: "💨", sub: "Surface wind" },
            { label: "Humidity", value: `${hourly?.relativehumidity_2m?.[0] ?? "—"}%`, icon: "💧", sub: "Relative humidity" },
            { label: "Rain Prob.", value: `${hourly?.precipitation_probability?.[0] ?? "—"}%`, icon: "🌧️", sub: "Next hour" },
          ].map((item) => (
            <div key={item.label} className="stat-card text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-2xl font-display font-semibold text-stone-800">{item.value}</p>
              <p className="text-xs text-stone-500 mt-1">{item.label}</p>
              <p className="text-xs text-stone-400">{item.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* 7-day forecast */}
      {weeklyForecast.length > 0 && (
        <div className="stat-card">
          <h3 className="font-display font-semibold text-stone-700 text-base mb-4">7-Day Forecast</h3>
          <div className="grid grid-cols-7 gap-2">
            {weeklyForecast.map((day) => {
              const { icon } = getWeatherDescription(day.code);
              const dateLabel = new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" });
              return (
                <div key={day.date} className="text-center p-2 rounded-xl bg-stone-50 hover:bg-green-50 transition-colors">
                  <p className="text-xs text-stone-500 font-medium">{dateLabel}</p>
                  <p className="text-xl my-1">{icon}</p>
                  <p className="text-xs font-semibold text-stone-700">{day.maxTemp}°</p>
                  <p className="text-xs text-stone-400">{day.minTemp}°</p>
                  <p className="text-xs text-sky-600 mt-1">{day.rain}mm</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Soil Health */}
      <div className="stat-card">
        <h3 className="font-display font-semibold text-stone-700 text-base mb-4">Soil Health Indicators</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SOIL_TIPS.map((tip) => (
            <div key={tip.label} className={`p-3 rounded-xl border ${tip.ok ? "border-green-100 bg-green-50" : "border-amber-100 bg-amber-50"}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-stone-700">{tip.label}</p>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${tip.ok ? "bg-green-200 text-green-700" : "bg-amber-200 text-amber-700"}`}>
                  {tip.ok ? "✓" : "!"}
                </span>
              </div>
              <p className={`text-base font-display font-semibold ${tip.ok ? "text-green-700" : "text-amber-700"}`}>{tip.value}</p>
              <p className="text-xs text-stone-500 mt-1">{tip.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory cards */}
      <div>
        <h3 className="font-display font-semibold text-stone-700 text-base mb-3">Active Advisories</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {ADVISORIES.map((adv, i) => {
            const c = ADVISORY_COLORS[adv.type];
            return (
              <div key={i} className={`p-4 rounded-xl border-l-4 ${c.border} ${c.bg}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{adv.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-stone-800 text-sm">{adv.title}</p>
                      <span className={`badge ${c.badge}`}>{adv.season}</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{adv.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
