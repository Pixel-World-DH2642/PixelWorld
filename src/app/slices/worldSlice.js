export const PANEL_STATES = {
  WEATHER: "weather",
  EDITOR: "editor",
  QUOTE: "quote",
};

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPanelState: PANEL_STATES.WEATHER,
};

export const worldSlice = createSlice({
  name: "world",
  initialState,
  reducers: {
    setPanelState: (state, action) => {
      state.currentPanelState = action.payload;
    },
  },
});

export const { setPanelState } = worldSlice.actions;

export default worldSlice.reducer;
