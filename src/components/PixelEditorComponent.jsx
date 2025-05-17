import {
  setColorPalette,
  setCurrentPaletteSlot,
  setCurrentTool,
} from "../app/slices/pixelEditorSlice";
import "../styles/global.css";
import { TOOL_MODE } from "../app/slices/pixelEditorSlice";

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
}) {
  //Tools
  //Color Palette
  //Pencil
  //Eraser
  //Fill
  //Color Picker
  //Color format?

  //Persist palette?

  //ToDo
  //-Focus palette cell logic for changing color
  //-Tool icons
  //-Tool functions
  //-Update sketch with props, dataflow

  //Setup
  const numPaletteSlots = 16;
  const palette = [];
  initializePalette();

  //let selectedPaletteSlot = null;

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
    } else {
      for (let i = 0; i < numPaletteSlots; i++) {
        palette[i] = {
          id: `paletteSlot${i}`,
          index: i,
          color: colorPaletteArray[i],
        };
      }
    }
  }

  function randomizePalette() {
    const colorBuffer = [];
    for (let i = 0; i < numPaletteSlots; i++) {
      const color = randomColor();
      //palette[i] = { id: `paletteSlot${i}`, color };
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
    onColorSelect(hexToRgb(e.target.dataset.color));
  }

  function handleColorChangeACB(e) {
    const slot = document.getElementById(palette[selectedPaletteSlot].id);
    slot.dataset.color = e.target.value;
    slot.style.backgroundColor = e.target.value;
    onColorSelect(hexToRgb(e.target.value));
  }

  function handleEraserSelected() {
    setCurrentTool(TOOL_MODE.ERASER);
  }

  function handlePencilSelected() {
    setCurrentTool(TOOL_MODE.PENCIL);
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
    <div className="flex flex-col w-full h-full border rounded-xl shadow-md bg-gray-50 border-gray-500 p-4">
      <div className="mb-2 sm:text-xl">Color Editor</div>
      <div className="flex h-full items-center justify-between">
        <div
          className="inline-grid grid-cols-4 gap-1 h-full aspect-square cursor-pointer p-4 bg-gray-200 rounded-md"
          onClick={handlePaletteClickedACB}
        >
          {paletteSlots}
        </div>
        <div className="rounded-md bg-gray-200 h-full p-2 flex-shrink w-16">
          <div className="flex flex-col items-center justify-center gap-2 text-sm">
            <div className="flex flex-col items-center justify-center">
              <input
                type="color"
                id="picker"
                name="color"
                value={
                  selectedPaletteSlot !== null
                    ? colorPaletteArray[selectedPaletteSlot]
                    : "#e62465"
                }
                className="cursor-pointer"
                onChange={handleColorChangeACB}
                disabled={selectedPaletteSlot === null}
              />
              <p>Color</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p>Random</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                className="w-10"
                src="assets/pencil_icon_64x64.png"
                alt="pencil"
              />
              <p>Pencil</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                className="w-10"
                src="assets/eraser_icon_64x64.png"
                alt="eraser"
              />
              <p>Eraser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
