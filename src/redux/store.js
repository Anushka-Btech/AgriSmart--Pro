import { configureStore } from "@reduxjs/toolkit";
import cropReducer from "./cropSlice";
import savedRecordsReducer from "./savedRecordsSlice";
import uiReducer from "./uiSlice";
import weatherReducer from "./weatherSlice";

export const store = configureStore({
  reducer: {
    crops: cropReducer,
    savedRecords: savedRecordsReducer,
    ui: uiReducer,
    weather: weatherReducer,
  },
});
