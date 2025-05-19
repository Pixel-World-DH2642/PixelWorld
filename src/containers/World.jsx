import { connect } from "react-redux";
import { WorldPage } from "../pages/WorldPage";
import {
  fetchDailyQuote,
  checkUserQuoteData,
  setQuoteSaved,
} from "../app/slices/quoteSlice";
import { getWeatherData } from "../app/slices/weatherSlice";
import {
  uploadPainting,
  fetchAllPaintings,
  updatePlayerPainting,
  undoEdit,
  redoEdit,
  getUndoStateHint,
  saveQuoteToPlayerPainting,
  removeQuoteFromPlayerPainting,
} from "../app/slices/paintingsSlice";
import {
  setCurrentTool,
  setCurrentColor,
  updateColorPalette,
  setColorPalette,
  setCurrentPaletteSlot,
  updatePixelArray,
  setPixelArray,
} from "../app/slices/pixelEditorSlice.js";
import { setPanelState } from "../app/slices/worldSlice";
import { hexToRgb } from "../utils/color.js";

export const World = connect(
  function mapStateToProps(state) {
    return {
      loading: state.paintings.loading,
      error: state.paintings.error,

      user: state.auth.user,

      weather: state.weather,
      weatherStatus: state.weather.status,
      weatherError: state.weather.error,

      paintingSubmission: {
        loading: state.paintings.loading,
        error: state.paintings.error,
      },
      // Current panel state
      currentPanelState: state.world.currentPanelState,

      //Pixel Editor Data
      colorPaletteArray: state.editor.colorPaletteArray,
      currentColor: state.editor.currentColor,
      currentTool: state.editor.currentTool,
      selectedPaletteSlot: state.editor.selectedPaletteSlot,
      //Painting Data
      playerPainting: state.paintings.playerPainting,

      //Quote data
      quote: state.quote.currentQuote,
      quotesRemaining: state.quote.quotesRemaining,
      quoteStatus: state.quote.status,
      quoteError: state.quote.error,
      includeQuote: state.quote.isQuoteSaved,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      // Quote
      onGetQuote: (userId) => dispatch(fetchDailyQuote(userId)),
      onCheckQuoteData: (userId) => dispatch(checkUserQuoteData(userId)),
      onSaveQuoteToPainting: (isChecked, quote) => {
        dispatch(saveQuoteToPlayerPainting({ isChecked, quote }));
        dispatch(setQuoteSaved(isChecked));
      },
      onRemoveQuoteFromPainting: (quote) => {
        dispatch(removeQuoteFromPlayerPainting());
        dispatch(setQuoteSaved(false));
      },

      onGetWeather: () => dispatch(getWeatherData()),
      // Panel state change handler
      onPanelStateChange: (state) => dispatch(setPanelState(state)),

      //Pixel Editor Slice Functions
      onToolSelect: (tool) => dispatch(setCurrentTool(tool)),
      onColorSelect: (color) => dispatch(setCurrentColor(color)),
      onPaletteUpdated: (slotData) => dispatch(updateColorPalette(slotData)),
      onPaletteInitialize: (paletteData) => {
        dispatch(setColorPalette(paletteData));
        dispatch(setCurrentPaletteSlot(0));
        dispatch(
          setCurrentColor({
            rgba: hexToRgb(paletteData[0]),
            hex: paletteData[0],
          }),
        );
      },
      onSlotSelected: (slot) => dispatch(setCurrentPaletteSlot(slot)),
      //Painting Slice Functions
      onPlayerPaintingUpdate: (painting) => {
        // console.log("Dispatching updatePlayerPainting with:", painting);
        dispatch(updatePlayerPainting(painting));
      },
      onUndoEdit: () => dispatch(undoEdit()),
      onRedoEdit: () => dispatch(redoEdit()),
      onGetUndoStateHint: () => dispatch(getUndoStateHint()),
      onSubmitPainting: (painting) => {
        dispatch(uploadPainting(painting));
      },
    };
  },
)(WorldPage);
