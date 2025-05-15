import { createSlice } from "@reduxjs/toolkit";

export const TOOL_MODE = {
  ERASER: "eraser",
  PENCIL: "pencil",
  FILL: "fill",
  //...
};

const initialState = {
  pixelArray: [],
  colorPaletteArray: [],
  currentColor: null,
  currentTool: TOOL_MODE.PENCIL,
};

export const pixelEditorSlice = createSlice({
  name: "pixel editor",
  initialState,
  reducers: {
    setCurrentTool: (state, action) => {
      state.currentTool = action.payload;
    },
    setCurrentColor: (state, action) => {
      state.currentColor = action.payload.color;
    },
    updatColorPalette: (state, action) => {
      state.colorPaletteArray[action.payload.index] = state.currentColor;
    },
    setColorPalette: (state, action) => {
      state.colorPaletteArray = action.payload;
    },
    updatePixelArray: (state, action) => {
      state.pixelArray[(action.payload.index.x, action.payload.index.y)] =
        action.payload.color;
    },
    setPixelArray: (state, action) => {
      state.pixelArray = action.payload;
    },
  },
});

//Actions

//Selectors

export default pixelEditorSlice.reducer;
