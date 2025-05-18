import "../styles/global.css";
import { TOOL_MODE } from "../app/slices/pixelEditorSlice";
import { useState, useEffect } from "react";

export function PixelEditorComponent({
  //State Properties
  colorPaletteArray,
  currentColor,
  currentTool,
  selectedPaletteSlot,
  //Functions
  onToolSelect,
  onColorSelect,
  onPaletteUpdated,
  onPaletteInitialize,
  onSlotSelected,
  //Painting Functions
  onUndoEdit,
  onRedoEdit,
  onGetUndoStateHint,
}) {
  //Tools
  //-Clear Drawing
  //-Fill
  //-Mini View

  //ToDo
  //Set initial color for color picker, model, and in the sketch

  //-optimize painting render
  //-Quote in world
  //-Get quote in world
  //-world overlay instructions

  //Panel state: quote, weather, pixel > world slice for dynamic context sensitive panel
  //

  //-Weather (implement more & better)

  //Quote bot, access, write out quote one character at a time

  //Bugs
  //-Tripple clicking a pixel grid throws read only error...
  //-No data to canvasActor from model until pixel editor update
  //-sky re-render problem
  //-color picker change
  //-Player jitter > add grounded state & turn off gravity

  //Setup
  const numPaletteSlots = 16;
  // Convert palette to a state variable
  const [palette, setPalette] = useState([]);
  // Default color to ensure picker is always controlled
  const [pickerColor, setPickerColor] = useState("#e62465");

  // Initialize palette effect
  useEffect(() => {
    initializePalette();
  }, [colorPaletteArray]);

  // Update picker color when selected slot changes
  useEffect(() => {
    if (
      selectedPaletteSlot !== null &&
      colorPaletteArray[selectedPaletteSlot]
    ) {
      setPickerColor(colorPaletteArray[selectedPaletteSlot]);
    }
  }, [selectedPaletteSlot, colorPaletteArray]);

  //Helpers
  function randomColor() {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  }

  //Hex to rgb algorithm borrowed from: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 255,
        }
      : null;
  }

  function initializePalette() {
    if (colorPaletteArray.length === 0) {
      onPaletteInitialize(randomizePalette());
      onColorSelect({
        rgba: hexToRgb(colorPaletteArray[0]),
        hex: colorPaletteArray[0],
      });
    } else {
      const newPalette = [];
      for (let i = 0; i < numPaletteSlots; i++) {
        newPalette[i] = {
          id: `paletteSlot${i}`,
          index: i,
          color: colorPaletteArray[i],
        };
      }
      setPalette(newPalette);
    }
  }

  function randomizePalette() {
    const colorBuffer = [];
    for (let i = 0; i < numPaletteSlots; i++) {
      const color = randomColor();
      colorBuffer.push(color);
    }
    return colorBuffer;
  }

  //Callbacks: Hook into PixelEditor container
  function handlePaletteClickedACB(e) {
    if (
      !e.target.dataset.color ||
      e.target.dataset.index === selectedPaletteSlot
    )
      return;

    // Reset previous selected slot if it exists
    if (selectedPaletteSlot !== null) {
      const previousSlot = document.getElementById(
        palette[selectedPaletteSlot].id,
      );
      if (previousSlot) {
        previousSlot.className = "aspect-square";
      }
    }

    // Set new selected slot
    e.target.className = "outline-2 aspect-square";
    onSlotSelected(parseInt(e.target.dataset.index));

    const newColor = e.target.dataset.color;
    setPickerColor(newColor);
    onColorSelect({
      rgba: hexToRgb(newColor),
      hex: newColor,
    });
  }

  function handleColorChangeACB(e) {
    const newColor = e.target.value;
    setPickerColor(newColor);

    if (selectedPaletteSlot !== null) {
      const slot = document.getElementById(palette[selectedPaletteSlot].id);
      slot.dataset.color = newColor;
      slot.style.backgroundColor = newColor;
      onColorSelect({ rgba: hexToRgb(newColor), hex: newColor });
    }
  }

  function handleEraserSelected() {
    onToolSelect(TOOL_MODE.ERASER);
  }

  function handlePencilSelected() {
    onToolSelect(TOOL_MODE.PENCIL);
  }

  function handleRandomizeClicked() {
    onPaletteInitialize(randomizePalette());
  }

  function handleUndoEdit() {
    onUndoEdit();
  }

  function handleRedoEdit() {
    onRedoEdit();
  }

  //Layout
  //Create palette slot elements
  const paletteSlots = palette.map((slot) => (
    <div
      className="aspect-square"
      key={slot.id}
      id={slot.id}
      data-color={slot.color}
      data-index={slot.index}
      style={{ backgroundColor: slot.color }}
    ></div>
  ));

  return (
    <div className="flex flex-col w-full h-full bg-gray-300 p-2 gap-2">
      <div className="sm:text-xl">Pixel Editor</div>
      <div className="flex items-center justify-center gap-2">
        <div
          className="inline-grid grid-cols-4 gap-1 w-50 aspect-square cursor-pointer p-4 bg-gray-100 rounded-md"
          onClick={handlePaletteClickedACB}
        >
          {paletteSlots}
        </div>
        <div className="grid grid-cols-2 gap-1 text-sm rounded-md bg-gray-100 p-2 h-50">
          <div className="flex flex-col items-center justify-center">
            <input
              type="color"
              id="picker"
              name="color"
              value={pickerColor}
              className="cursor-pointer"
              onChange={handleColorChangeACB}
              disabled={selectedPaletteSlot === null}
            />
            <p>Color</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              className="w-10"
              src="assets/random_icon_64x64.png"
              alt="randomize palette"
              onClick={handleRandomizeClicked}
            />
            <p>Random</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              className="w-10"
              src="assets/pencil_icon_64x64.png"
              alt="pencil"
              onClick={handlePencilSelected}
            />
            <p>Pencil</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              className="w-10"
              src="assets/eraser_icon_64x64_new.png"
              alt="eraser"
              onClick={handleEraserSelected}
            />
            <p>Eraser</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              className="w-10"
              src="assets/undo_icon_64x64.png"
              alt="undo"
              onClick={handleUndoEdit}
            />
            <p>Undo</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              className="w-10"
              src="assets/redo_icon_64x64.png"
              alt="redo"
              onClick={handleRedoEdit}
            />
            <p>Redo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
