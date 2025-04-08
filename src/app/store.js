import { configureStore } from "@reduxjs/toolkit";

export default function configureReduxStore() {
  console.log("Configuring Redux store...");
  const initialState = {};
  return configureStore({
    reducer: {},
    preloadedState: initialState,
  });
}
