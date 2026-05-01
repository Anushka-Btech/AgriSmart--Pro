import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWeather, AG_LOCATIONS } from "../api/weatherApi";

export const loadWeather = createAsyncThunk("weather/load", async ({ lat, lon } = {}, { rejectWithValue }) => {
  try {
    const loc = AG_LOCATIONS[0];
    return await fetchWeather(lat || loc.lat, lon || loc.lon);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    data: null,
    selectedLocation: AG_LOCATIONS[0],
    status: "idle",
    error: null,
  },
  reducers: {
    setLocation(state, action) { state.selectedLocation = action.payload; state.status = "idle"; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWeather.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(loadWeather.fulfilled, (state, action) => { state.status = "succeeded"; state.data = action.payload; })
      .addCase(loadWeather.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; });
  },
});

export const { setLocation } = weatherSlice.actions;
export default weatherSlice.reducer;
