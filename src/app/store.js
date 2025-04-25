import { configureStore } from "@reduxjs/toolkit";
import quoteSlice from "./slices/quoteSlice";
import weatherSlice from "./slices/weatherSlice";

export default function configureReduxStore() {
  console.log("Configuring Redux store...");
  const initialState = {};
  return configureStore({
    reducer: {
      quote: quoteSlice,
      weather: weatherSlice,
    },
    preloadedState: initialState,
  });
}
