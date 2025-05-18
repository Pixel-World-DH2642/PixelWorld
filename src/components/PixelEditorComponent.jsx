import "../styles/global.css";
import { TOOL_MODE } from "../app/slices/pixelEditorSlice";
import { useState, useEffect } from "react";
import { randomColor, hexToRgb } from "../utils/color";

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

  function initializePalette() {
    if (colorPaletteArray.length === 0) {
      onPaletteInitialize(randomizePalette());
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
    if (!e.target.dataset.color) return;

    const clickedSlotIndex = parseInt(e.target.dataset.index);
    if (clickedSlotIndex === selectedPaletteSlot) return;

    // Update the selected slot in state
    onSlotSelected(clickedSlotIndex);

    // Update color based on the selected slot
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
      className={`aspect-square ${selectedPaletteSlot === slot.index ? "outline-2 outline outline-black" : ""}`}
      key={slot.id}
      id={slot.id}
      data-color={slot.color}
      data-index={slot.index}
      style={{ backgroundColor: slot.color }}
    ></div>
  ));

  const ToolSlot = ({ name, src, alt, onClick, isSelected }) => {
    return (
      <div
        className={`flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 p-1 rounded-md ${
          isSelected ? "bg-blue-200 border-blue-500" : "hover:bg-gray-200 "
        } active:bg-blue-300`}
        onClick={onClick}
      >
        <img className="w-8" src={src} alt={alt} />
        <p className={isSelected ? "font-bold" : ""}>{name}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-300 p-2 gap-2">
      <div className="sm:text-xl">Pixel Editor</div>
      <div className="flex items-center justify-center gap-2 h-50">
        <div
          className="inline-grid grid-cols-4 gap-1 h-full aspect-square cursor-pointer p-4 bg-gray-100 rounded-md"
          onClick={handlePaletteClickedACB}
        >
          {paletteSlots}
        </div>
        <div className="grid grid-cols-2 gap-1 text-sm rounded-md bg-gray-100 p-2 h-50 overflow-hidden">
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

          <ToolSlot
            name="Random"
            src="assets/random_icon_64x64.png"
            alt="randomize palette"
            onClick={handleRandomizeClicked}
          />
          <ToolSlot
            name="Pencil"
            src="assets/pencil_icon_64x64.png"
            alt="pencil"
            onClick={handlePencilSelected}
            isSelected={currentTool === TOOL_MODE.PENCIL}
          />
          <ToolSlot
            name="Eraser"
            src="assets/eraser_icon_64x64_new.png"
            alt="eraser"
            onClick={handleEraserSelected}
            isSelected={currentTool === TOOL_MODE.ERASER}
          />
          <ToolSlot
            name="Undo"
            src="assets/undo_icon_64x64.png"
            alt="undo"
            onClick={handleUndoEdit}
          />
          <ToolSlot
            name="Redo"
            src="assets/redo_icon_64x64.png"
            alt="redo"
            onClick={handleRedoEdit}
          />
        </div>
      </div>
    </div>
  );
}
