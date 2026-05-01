import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCropPrices, fetchMarketSummary } from "../api/cropApi";

export const loadCropPrices = createAsyncThunk("crops/loadPrices", async (_, { rejectWithValue }) => {
  try {
    const [prices, summary] = await Promise.all([fetchCropPrices(), fetchMarketSummary()]);
    return { prices, summary };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const cropSlice = createSlice({
  name: "crops",
  initialState: {
    list: [],
    summary: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    searchQuery: "",
    filterCategory: "All",
    currentPage: 1,
    itemsPerPage: 8,
  },
  reducers: {
    setSearchQuery(state, action) { state.searchQuery = action.payload; state.currentPage = 1; },
    setFilterCategory(state, action) { state.filterCategory = action.payload; state.currentPage = 1; },
    setCurrentPage(state, action) { state.currentPage = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCropPrices.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(loadCropPrices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.prices;
        state.summary = action.payload.summary;
      })
      .addCase(loadCropPrices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setFilterCategory, setCurrentPage } = cropSlice.actions;
export default cropSlice.reducer;

// Selectors
export const selectFilteredCrops = (state) => {
  const { list, searchQuery, filterCategory } = state.crops;
  return list.filter((crop) => {
    const matchSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === "All" || crop.category === filterCategory;
    return matchSearch && matchCategory;
  });
};

export const selectPaginatedCrops = (state) => {
  const filtered = selectFilteredCrops(state);
  const { currentPage, itemsPerPage } = state.crops;
  const start = (currentPage - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
};

export const selectTotalPages = (state) => {
  const filtered = selectFilteredCrops(state);
  return Math.ceil(filtered.length / state.crops.itemsPerPage);
};
