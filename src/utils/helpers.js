export const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (isoString) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoString));
};

export const getChangeColor = (change) => {
  if (change > 0) return "text-green-600";
  if (change < 0) return "text-red-500";
  return "text-stone-500";
};

export const getChangeBg = (change) => {
  if (change > 0) return "bg-green-50 text-green-700";
  if (change < 0) return "bg-red-50 text-red-600";
  return "bg-stone-100 text-stone-600";
};

export const getCategoryColor = (category) => {
  const map = {
    Cereals: "bg-amber-50 text-amber-700",
    "Cash Crops": "bg-purple-50 text-purple-700",
    Oilseeds: "bg-yellow-50 text-yellow-700",
    Vegetables: "bg-green-50 text-green-700",
  };
  return map[category] || "bg-stone-100 text-stone-600";
};

export const getSeasonColor = (season) => {
  const map = {
    Kharif: "bg-sky-50 text-sky-700",
    Rabi: "bg-orange-50 text-orange-700",
    Annual: "bg-teal-50 text-teal-700",
  };
  return map[season] || "bg-stone-100 text-stone-600";
};

export const CROP_CATEGORIES = ["All", "Cereals", "Cash Crops", "Oilseeds", "Vegetables"];
