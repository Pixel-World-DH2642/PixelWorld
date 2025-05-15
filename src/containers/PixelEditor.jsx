import { connect } from "react-redux";
import { PixelEditorComponent } from "../components/PixelEditorComponent";
import {
  setCurrentTool,
  setCurrentColor,
  updateColorPalette,
  setColorPalette,
  updatePixelArray,
  setPixelArray,
} from "../app/slices/pixelEditorSlice.js";

//Migrate this whole presenter into World.jsx!!!

export const PixelEditor = connect(
  function mapStateToProps(state) {
    return {
      //not sure if we need anything here...
      colorPaletteArray: state.colorPaletteArray,

    };
  },

  function mapDispatchToProps(dispatch) {
    return {
      //Hook callbacks into slice functions
      onToolSelect: (tool) => dispatch(setCurrentTool(tool)),
      onColorSelect: (color) => dispatch(setCurrentColor(color)),
      onPaletteUpdated: (slotData) => dispatch(updateColorPalette(slotData)),
      onPaletteInitialize: (paletteData) => dispatch(setColorPalette(paletteData));
      onImageUpdated: (pixelData) => dispatch(updatePixelArray(pixelData)),
      onImageInitialized: (imageData) => dispatch(setPixelArray(imageData)),
      
    };
  },
)(PixelEditorComponent);
