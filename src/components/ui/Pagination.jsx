import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, selectTotalPages } from "../../redux/cropSlice";

export default function Pagination() {
  const dispatch = useDispatch();
  const currentPage = useSelector((s) => s.crops.currentPage);
  const totalPages = useSelector(selectTotalPages);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-4">
      <button
        onClick={() => dispatch(setCurrentPage(currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ←
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => dispatch(setCurrentPage(p))}
          className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
            p === currentPage
              ? "bg-green-700 text-white"
              : "text-stone-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => dispatch(setCurrentPage(currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        →
      </button>
    </div>
  );
}
