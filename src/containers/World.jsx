import { connect } from "react-redux";
import { WorldPage } from "../pages/WorldPage";
import { fetchDailyQuote } from "../app/slices/quoteSlice";
import { getWeatherData } from "../app/slices/weatherSlice";
import {
  uploadPainting,
  fetchAllPaintings,
  updatePlayerPainting,
  undoEdit,
  getUndoStateHint,
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

export const World = connect(
  function mapStateToProps(state) {
    return {
      user: state.auth.user,
      quote: state.quote.currentQuote,
      weather: state.weather,
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
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onGetQuote: () => dispatch(fetchDailyQuote()),
      onGetWeather: () => dispatch(getWeatherData()),
      // Panel state change handler
      onPanelStateChange: (state) => dispatch(setPanelState(state)),

      //Pixel Editor Slice Functions
      onToolSelect: (tool) => dispatch(setCurrentTool(tool)),
      onColorSelect: (color) => dispatch(setCurrentColor(color)),
      onPaletteUpdated: (slotData) => dispatch(updateColorPalette(slotData)),
      onPaletteInitialize: (paletteData) =>
        dispatch(setColorPalette(paletteData)),
      onSlotSelected: (slot) => dispatch(setCurrentPaletteSlot(slot)),
      //Painting Slice Functions
      onPlayerPaintingUpdate: (painting) =>
        dispatch(updatePlayerPainting(painting)),
      onUndoEdit: () => dispatch(undoEdit()),
      onRedoEdit: () => dispatch(redoEdit()),
      onGetUndoStateHint: () => dispatch(getUndoStateHint()),
      onSubmitPainting: (painting) => {
        return dispatch(uploadPainting(painting)).then(() => {
          return dispatch(fetchAllPaintings());
        });
      },
    };
  },
)(WorldPage);
