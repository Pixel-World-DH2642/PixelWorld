import { configureStore } from "@reduxjs/toolkit";
import quoteSlice from "./slices/quoteSlice";
import paintingSlice from "./slices/paintingSlice";

export default function configureReduxStore() {
  console.log("Configuring Redux store...");
  const initialState = {};
  return configureStore({
    reducer: {
      quote: quoteSlice,
      painting: paintingSlice,
    },
    preloadedState: initialState,
  });
}
