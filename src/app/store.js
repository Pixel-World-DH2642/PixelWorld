import { configureStore } from "@reduxjs/toolkit";
import quoteSlice from "./slices/quoteSlice";

export default function configureReduxStore() {
  console.log("Configuring Redux store...");
  const initialState = {};
  return configureStore({
    reducer: {
      quote: quoteSlice,
    },
    preloadedState: initialState,
  });
}
