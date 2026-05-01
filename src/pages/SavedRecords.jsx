import { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRecord, deleteRecord, updateRecord } from "../redux/savedRecordsSlice";
import { useToast } from "../hooks/useAppHooks";
import { formatDate, formatCurrency, getCategoryColor } from "../utils/helpers";

const EMPTY_FORM = {
  cropName: "", category: "Cereals", quantity: "", unit: "quintal",
  purchasePrice: "", sellingPrice: "", notes: "", season: "Kharif",
};

const CATEGORIES = ["Cereals", "Cash Crops", "Oilseeds", "Vegetables"];
const SEASONS = ["Kharif", "Rabi", "Annual"];
const UNITS = ["quintal", "kg", "tonne", "bag"];

export default function SavedRecords() {
  const dispatch = useDispatch();
  const records = useSelector((s) => s.savedRecords.records);
  const { show: showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [searchQ, setSearchQ] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() =>
    records.filter((r) => r.cropName.toLowerCase().includes(searchQ.toLowerCase())),
    [records, searchQ]
  );

  const totalProfit = useMemo(() =>
    records.reduce((sum, r) => {
      const profit = (parseFloat(r.sellingPrice) - parseFloat(r.purchasePrice)) * parseFloat(r.quantity || 0);
      return sum + (isNaN(profit) ? 0 : profit);
    }, 0),
    [records]
  );

  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setFormOpen(true); };
  const openEdit = (record) => {
    setForm({ cropName: record.cropName, category: record.category, quantity: record.quantity,
      unit: record.unit, purchasePrice: record.purchasePrice, sellingPrice: record.sellingPrice,
      notes: record.notes || "", season: record.season });
    setEditingId(record.id);
    setFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cropName.trim()) return;
    if (editingId) {
      dispatch(updateRecord({ id: editingId, ...form }));
      showToast("Record updated successfully", "success");
    } else {
      dispatch(addRecord(form));
      showToast("Record saved successfully", "success");
    }
    setFormOpen(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteRecord(id));
    showToast("Record deleted", "error");
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-5">
      {/* Header & stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Total Records</p>
          <p className="text-3xl font-display font-semibold text-green-700">{records.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Net Profit/Loss</p>
          <p className={`text-2xl font-display font-semibold ${totalProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
            {totalProfit >= 0 ? "+" : ""}{formatCurrency(totalProfit)}
          </p>
        </div>
        <div className="stat-card col-span-2 sm:col-span-1">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Categories</p>
          <p className="text-2xl font-display font-semibold text-stone-700">
            {new Set(records.map((r) => r.category)).size}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search records..." value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)} className="input-field pl-9" />
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <span>+</span> Add Crop Record
        </button>
      </div>

      {/* Add/Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-display font-semibold text-stone-800 text-lg">
                {editingId ? "Edit Record" : "New Crop Record"}
              </h3>
              <button onClick={() => setFormOpen(false)} className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-stone-600 mb-1">Crop Name *</label>
                  <input name="cropName" value={form.cropName} onChange={handleChange}
                    required className="input-field" placeholder="e.g. Wheat" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Season</label>
                  <select name="season" value={form.season} onChange={handleChange} className="input-field">
                    {SEASONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Quantity</label>
                  <input name="quantity" value={form.quantity} onChange={handleChange} type="number" min="0"
                    className="input-field" placeholder="100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Unit</label>
                  <select name="unit" value={form.unit} onChange={handleChange} className="input-field">
                    {UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Purchase Price (₹)</label>
                  <input name="purchasePrice" value={form.purchasePrice} onChange={handleChange} type="number" min="0"
                    className="input-field" placeholder="2000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Selling Price (₹)</label>
                  <input name="sellingPrice" value={form.sellingPrice} onChange={handleChange} type="number" min="0"
                    className="input-field" placeholder="2300" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-stone-600 mb-1">Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                    className="input-field resize-none" placeholder="Optional notes..." />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editingId ? "Update Record" : "Save Record"}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-display font-semibold text-stone-800 text-lg mb-2">Delete Record?</h3>
            <p className="text-sm text-stone-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                Delete
              </button>
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Records list */}
      {filtered.length === 0 ? (
        <div className="stat-card text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-stone-500 text-sm">
            {records.length === 0 ? "No records yet. Start by adding a crop record." : "No records match your search."}
          </p>
          {records.length === 0 && (
            <button onClick={openAdd} className="btn-primary mt-4">Add Your First Record</button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                {["Crop", "Category", "Season", "Quantity", "Buy Price", "Sell Price", "Profit/Loss", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => {
                const profit = (parseFloat(record.sellingPrice) - parseFloat(record.purchasePrice)) * parseFloat(record.quantity || 0);
                const hasProfit = !isNaN(profit);
                return (
                  <tr key={record.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-800">{record.cropName}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getCategoryColor(record.category)}`}>{record.category}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{record.season}</td>
                    <td className="px-4 py-3 font-mono text-stone-600">{record.quantity} {record.unit}</td>
                    <td className="px-4 py-3 font-mono text-stone-600">{record.purchasePrice ? formatCurrency(record.purchasePrice) : "—"}</td>
                    <td className="px-4 py-3 font-mono text-stone-600">{record.sellingPrice ? formatCurrency(record.sellingPrice) : "—"}</td>
                    <td className="px-4 py-3">
                      {hasProfit ? (
                        <span className={`badge ${profit >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                          {profit >= 0 ? "+" : ""}{formatCurrency(profit)}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-400">{formatDate(record.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(record)}
                          className="px-2.5 py-1.5 text-xs rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors font-medium">
                          Edit
                        </button>
                        <button onClick={() => setConfirmDelete(record.id)} className="btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
