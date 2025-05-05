import { configureStore, createSlice } from "@reduxjs/toolkit";
import quoteSlice from "./slices/quoteSlice";
import paintingSlice from "./slices/paintingSlice";
import weatherSlice from "./slices/weatherSlice";
import authSlice from "./slices/authSlice";

const appSlice = createSlice({
  name: "app",
  initialState: {
    ready: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    setReady: (state) => {
      state.ready = true;
    },
  },
});

export const { setReady } = appSlice.actions;

export default function configureReduxStore() {
  console.log("Configuring Redux store...");
  const initialState = {};
  return configureStore({
    reducer: {
      app: appSlice.reducer,
      auth: authSlice,
      quote: quoteSlice,
      painting: paintingSlice,
      weather: weatherSlice,
    },
    preloadedState: initialState,
  });
}
