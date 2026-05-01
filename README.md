# 🌱 AgriSmart Pro — Crop Advisory & Market Intelligence Dashboard

A full-stack frontend React dashboard for Indian agriculture — crop market prices, weather advisory, and crop record management.

## Website delpoyed is live at- https://agri-smart-pro-hwf9-g8udvri75-anushkachhoker60-1749s-projects.vercel.app/

## Tech Stack
- **React 19** + Vite
- **Redux Toolkit** — state management
- **React Router v7** — routing
- **Axios** — API integration
- **Recharts** — charts and data viz
- **Tailwind CSS v3** — styling
- **Open-Meteo API** — live weather (no API key needed)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Pages
| Route | Description |
|-------|-------------|
| `/` | Dashboard — stat cards, price trends, category charts |
| `/market` | Market Prices — search, filter, paginated table with sparklines |
| `/advisory` | Crop Advisory — live weather, 7-day forecast, soil health, advisories |
| `/saved` | Saved Records — full CRUD with profit/loss calculation |

## Features
- ✅ Live weather from Open-Meteo (no API key)
- ✅ Simulated market prices for 15 Indian crops
- ✅ Search + category filter on Market page
- ✅ Pagination (8 items/page)
- ✅ Full CRUD on Saved Records (persists to localStorage)
- ✅ Dashboard with Line, Bar, Pie charts (Recharts)
- ✅ Lazy loading with React.lazy + Suspense
- ✅ useMemo / useCallback for performance
- ✅ Error Boundary
- ✅ Loading skeletons and toast notifications
- ✅ Responsive sidebar layout
