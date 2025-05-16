import { connect } from "react-redux";
import { WorldPage } from "../pages/WorldPage";
import { fetchDailyQuote } from "../app/slices/quoteSlice";
import { getWeatherData } from "../app/slices/weatherSlice";
import { pixelEditorSlice } from "../app/slices/pixelEditorSlice";
import {
  setCurrentTool,
  setCurrentColor,
  updateColorPalette,
  setColorPalette,
  setCurrentPaletteSlot,
  updatePixelArray,
  setPixelArray,
} from "../app/slices/pixelEditorSlice.js";

export const World = connect(
  function mapStateToProps(state) {
    return {
      quote: state.quote.currentQuote,
      weather: state.weather,

      //Pixel Editor Data
      colorPaletteArray: state.editor.colorPaletteArray,
      currentColor: state.editor.currentColor,
      currentTool: state.editor.currentTool,
      selectedPaletteSlot: state.editor.selectedPaletteSlot,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onGetQuote: () => dispatch(fetchDailyQuote()),
      onGetWeather: () => dispatch(getWeatherData()),
      //Pixel Editor Slice Functions
      onToolSelect: (tool) => dispatch(setCurrentTool(tool)),
      onColorSelect: (color) => dispatch(setCurrentColor(color)),
      onPaletteUpdated: (slotData) => dispatch(updateColorPalette(slotData)),
      onPaletteInitialize: (paletteData) =>
        dispatch(setColorPalette(paletteData)),
      onSlotSelected: (slot) => dispatch(setCurrentPaletteSlot(slot)),
      //This should go into a different slice probably...
      onImageUpdated: (pixelData) => dispatch(updatePixelArray(pixelData)),
      onImageInitialized: (imageData) => dispatch(setPixelArray(imageData)),
    };
  },
)(WorldPage);
