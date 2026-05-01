import { useSelector } from "react-redux";

const ICONS = { success: "✓", error: "✗", info: "ℹ" };
const COLORS = {
  success: "bg-green-700 text-white",
  error: "bg-red-600 text-white",
  info: "bg-stone-700 text-white",
};

export default function Toast() {
  const toast = useSelector((s) => s.ui.toast);
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
      ${COLORS[toast.type]} animate-[fadeSlideIn_0.2s_ease-out]`}
    >
      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
        {ICONS[toast.type]}
      </span>
      {toast.message}
    </div>
  );
}
