// Simulated market price data (in INR per quintal)
const BASE_PRICES = {
  Wheat:      { base: 2275, unit: "quintal", category: "Cereals",    season: "Rabi" },
  Rice:       { base: 2183, unit: "quintal", category: "Cereals",    season: "Kharif" },
  Maize:      { base: 1962, unit: "quintal", category: "Cereals",    season: "Kharif" },
  Cotton:     { base: 6620, unit: "quintal", category: "Cash Crops", season: "Kharif" },
  Soybean:    { base: 4600, unit: "quintal", category: "Oilseeds",   season: "Kharif" },
  Mustard:    { base: 5450, unit: "quintal", category: "Oilseeds",   season: "Rabi" },
  Sugarcane:  { base: 315,  unit: "quintal", category: "Cash Crops", season: "Annual" },
  Potato:     { base: 1200, unit: "quintal", category: "Vegetables", season: "Rabi" },
  Onion:      { base: 1100, unit: "quintal", category: "Vegetables", season: "Rabi" },
  Tomato:     { base: 1800, unit: "quintal", category: "Vegetables", season: "Annual" },
  Bajra:      { base: 2350, unit: "quintal", category: "Cereals",    season: "Kharif" },
  Ragi:       { base: 3846, unit: "quintal", category: "Cereals",    season: "Kharif" },
  Sunflower:  { base: 5800, unit: "quintal", category: "Oilseeds",   season: "Rabi" },
  Jute:       { base: 5050, unit: "quintal", category: "Cash Crops", season: "Kharif" },
  Groundnut:  { base: 5850, unit: "quintal", category: "Oilseeds",   season: "Kharif" },
};

const fluctuate = (base, pct = 0.08) => {
  const delta = base * pct * (Math.random() * 2 - 1);
  return Math.round(base + delta);
};

const generateWeeklyTrend = (base) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    price: fluctuate(base, 0.04),
  }));
};

export const fetchCropPrices = async () => {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  return Object.entries(BASE_PRICES).map(([name, info], idx) => {
    const currentPrice = fluctuate(info.base);
    const prevPrice = fluctuate(info.base);
    const change = currentPrice - prevPrice;
    const changePct = ((change / prevPrice) * 100).toFixed(2);

    return {
      id: idx + 1,
      name,
      currentPrice,
      prevPrice,
      change,
      changePct: parseFloat(changePct),
      unit: info.unit,
      category: info.category,
      season: info.season,
      msp: info.base,
      weeklyTrend: generateWeeklyTrend(info.base),
      marketplaces: ["APMC Delhi", "APMC Mumbai", "Mandi Punjab"][idx % 3],
      lastUpdated: new Date().toISOString(),
    };
  });
};

export const fetchMarketSummary = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return {
    totalCrops: Object.keys(BASE_PRICES).length,
    avgChangeToday: "+1.2%",
    topGainer: { name: "Cotton", change: "+3.4%" },
    topLoser: { name: "Potato", change: "-2.1%" },
    monthlyData: [
      { month: "Nov", wheat: 2180, rice: 2100, cotton: 6400 },
      { month: "Dec", wheat: 2220, rice: 2130, cotton: 6480 },
      { month: "Jan", wheat: 2260, rice: 2160, cotton: 6520 },
      { month: "Feb", wheat: 2275, rice: 2183, cotton: 6580 },
      { month: "Mar", wheat: 2290, rice: 2200, cotton: 6620 },
      { month: "Apr", wheat: 2310, rice: 2183, cotton: 6700 },
    ],
  };
};
