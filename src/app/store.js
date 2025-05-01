import { configureStore } from "@reduxjs/toolkit";
import quoteSlice from "./slices/quoteSlice";
import museumSlice from "./slices/museumSlice"; 

export default function configureReduxStore() {
  console.log("Configuring Redux store...");
  const initialState = {};
  return configureStore({
    reducer: {
      quote: quoteSlice,
      museum: museumSlice, 
    },
    preloadedState: initialState,
  });
}