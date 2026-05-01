import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../redux/uiSlice";
import { useLocation } from "react-router-dom";
import Toast from "../ui/Toast";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/market": "Market Prices",
  "/advisory": "Crop Advisory",
  "/saved": "Saved Records",
};

export default function Topbar() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || "AgriSmart Pro";

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-stone-100 px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="font-display font-semibold text-stone-800 text-lg">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-stone-400 hidden sm:block">
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
          <span className="text-white text-xs font-semibold">AG</span>
        </div>
      </div>
      <Toast />
    </header>
  );
}
