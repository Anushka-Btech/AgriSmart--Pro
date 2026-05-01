import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "agrismart_saved_records";

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveToStorage = (records) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch {}
};

const initialState = {
  records: loadFromStorage(),
  formOpen: false,
};

const savedRecordsSlice = createSlice({
  name: "savedRecords",
  initialState,
  reducers: {
    addRecord(state, action) {
      const record = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      state.records.unshift(record);
      saveToStorage(state.records);
    },
    deleteRecord(state, action) {
      state.records = state.records.filter((r) => r.id !== action.payload);
      saveToStorage(state.records);
    },
    updateRecord(state, action) {
      const idx = state.records.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) {
        state.records[idx] = { ...state.records[idx], ...action.payload };
        saveToStorage(state.records);
      }
    },
    setFormOpen(state, action) { state.formOpen = action.payload; },
  },
});

export const { addRecord, deleteRecord, updateRecord, setFormOpen } = savedRecordsSlice.actions;
export default savedRecordsSlice.reducer;
