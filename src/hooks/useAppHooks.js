import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCropPrices } from "../redux/cropSlice";
import { loadWeather } from "../redux/weatherSlice";
import { showToast, clearToast } from "../redux/uiSlice";

export const useCropData = () => {
  const dispatch = useDispatch();
  const { list, summary, status, error } = useSelector((s) => s.crops);

  useEffect(() => {
    if (status === "idle") dispatch(loadCropPrices());
  }, [status, dispatch]);

  const refresh = useCallback(() => {
    dispatch(loadCropPrices());
  }, [dispatch]);

  return { list, summary, status, error, refresh };
};

export const useWeatherData = () => {
  const dispatch = useDispatch();
  const { data, selectedLocation, status, error } = useSelector((s) => s.weather);

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadWeather({ lat: selectedLocation.lat, lon: selectedLocation.lon }));
    }
  }, [status, selectedLocation, dispatch]);

  return { data, selectedLocation, status, error };
};

export const useToast = () => {
  const dispatch = useDispatch();
  const toast = useSelector((s) => s.ui.toast);

  const show = useCallback(
    (message, type = "success") => {
      dispatch(showToast({ message, type }));
      setTimeout(() => dispatch(clearToast()), 3000);
    },
    [dispatch]
  );

  return { toast, show };
};
