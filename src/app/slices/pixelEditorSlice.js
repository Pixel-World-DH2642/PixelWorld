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
  currentColor: { rgba: { r: 0, g: 0, b: 0, a: 0 }, hex: "#00000000" },
  currentTool: TOOL_MODE.PENCIL,
  selectedPaletteSlot: 0,
};

export const pixelEditorSlice = createSlice({
  name: "pixel editor",
  initialState,
  reducers: {
    setCurrentTool: (state, action) => {
      state.currentTool = action.payload;
    },
    setCurrentColor: (state, action) => {
      state.currentColor = action.payload;
    },
    updatColorPalette: (state, action) => {
      state.colorPaletteArray[action.payload.index] = state.currentColor;
    },
    setColorPalette: (state, action) => {
      state.colorPaletteArray = action.payload;
    },
    setCurrentPaletteSlot: (state, action) => {
      state.selectedPaletteSlot = action.payload;
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
export const {
  setCurrentTool,
  setCurrentColor,
  updateColorPalette,
  setColorPalette,
  setCurrentPaletteSlot,
  updatePixelArray,
  setPixelArray,
} = pixelEditorSlice.actions;
//Selectors

export default pixelEditorSlice.reducer;
