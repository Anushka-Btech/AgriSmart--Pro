import axios from "axios";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

// Major Indian agricultural regions
export const AG_LOCATIONS = [
  { name: "Punjab", lat: 30.9, lon: 75.8, crops: ["Wheat", "Rice", "Maize"] },
  { name: "Maharashtra", lat: 19.7, lon: 75.7, crops: ["Cotton", "Soybean", "Sugarcane"] },
  { name: "Rajasthan", lat: 27.0, lon: 74.2, crops: ["Mustard", "Bajra", "Wheat"] },
  { name: "Karnataka", lat: 15.3, lon: 75.7, crops: ["Ragi", "Sunflower", "Maize"] },
  { name: "West Bengal", lat: 22.9, lon: 87.8, crops: ["Rice", "Jute", "Potato"] },
];

export const fetchWeather = async (lat = 26.9, lon = 75.8) => {
  const response = await axios.get(BASE_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current_weather: true,
      hourly: "temperature_2m,relativehumidity_2m,precipitation_probability,windspeed_10m",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
      timezone: "Asia/Kolkata",
      forecast_days: 7,
    },
  });
  return response.data;
};

// WMO Weather Code to description
export const getWeatherDescription = (code) => {
  const map = {
    0: { label: "Clear Sky", icon: "☀️" },
    1: { label: "Mainly Clear", icon: "🌤️" },
    2: { label: "Partly Cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Foggy", icon: "🌫️" },
    51: { label: "Light Drizzle", icon: "🌦️" },
    61: { label: "Rain", icon: "🌧️" },
    71: { label: "Snow", icon: "❄️" },
    80: { label: "Rain Showers", icon: "🌧️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
  };
  return map[code] || { label: "Unknown", icon: "🌡️" };
};
