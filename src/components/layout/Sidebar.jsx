import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/uiSlice";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "▦", exact: true },
  { to: "/market", label: "Market Prices", icon: "📈" },
  { to: "/advisory", label: "Crop Advisory", icon: "🌦️" },
  { to: "/saved", label: "Saved Records", icon: "📋" },
];

export default function Sidebar() {
  const { sidebarOpen } = useSelector((s) => s.ui);
  const dispatch = useDispatch();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-20 flex flex-col
          bg-white border-r border-stone-100 transition-all duration-300
          ${sidebarOpen ? "w-60" : "w-0 lg:w-16 overflow-hidden"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-stone-100">
          <div className="w-8 h-8 bg-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">🌱</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-display font-semibold text-stone-800 text-sm leading-tight">AgriSmart</p>
              <p className="text-xs text-stone-400 leading-tight">Pro Dashboard</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""} ${!sidebarOpen ? "justify-center px-0" : ""}`
              }
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="px-5 py-4 border-t border-stone-100">
            <p className="text-xs text-stone-400">v1.0 · Data updates every session</p>
          </div>
        )}
      </aside>
    </>
  );
}
