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
  //Painting Functions
  onUndoEdit,
  onRedoEdit,
  onGetUndoStateHint,
}) {
  //Tools
  //-Clear Drawing
  //-Fill
  //-Randomize
  //-Undo
  //-Redo
  //-Mini View

  //Persist palette?

  //ToDo
  //-playerPainting -> in the painting slice
  //-painting data through model not sketch
  //-optomize painting render
  //-Quote in world
  //-Get quote in world
  //-world overlay instructions

  //pixel editor not color editor
  //Panel state: quote, weather, pixel > world slice for dynamic context sensitive panel
  //

  //-Weather
  //-Drag to draw
  //-eraser, pencil in sketch
  //-store drawing in model

  //Quote bot, access, write out quote one character at a time

  //Bugs
  //-No data to canvasActor from model until pixel editor update
  //-sky re-render problem
  //-color picker change
  //-Player jitter > add grounded state & turn off gravity

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
    onColorSelect({
      rgba: hexToRgb(e.target.dataset.color),
      hex: e.target.dataset.color,
    });
  }

  function handleColorChangeACB(e) {
    const slot = document.getElementById(palette[selectedPaletteSlot].id);
    slot.dataset.color = e.target.value;
    slot.style.backgroundColor = e.target.value;
    onColorSelect({ rgba: hexToRgb(e.target.value), hex: e.target.value });
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
    console.log("p undo");
    onUndoEdit();
  }

  function handleRedoEdit() {
    console.log("p redo");
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
    <div className="flex flex-col justify-between w-full h-full bg-gray-300 p-2 gap-2">
      <div className="sm:text-xl">Pixel Editor</div>
      <div
        className="inline-grid grid-cols-4 gap-1 w-full aspect-square cursor-pointer p-4 bg-gray-100 rounded-md"
        onClick={handlePaletteClickedACB}
      >
        {paletteSlots}
      </div>
      <div className="flex items-center justify-center gap-2 text-sm rounded-md bg-gray-100 p-2">
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
          <button className="w-10" onClick={handleUndoEdit}>
            Undo
          </button>
          <p>Undo</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <button className="w-10" onClick={handleRedoEdit}>
            Redo
          </button>
          <p>Redo</p>
        </div>
      </div>
    </div>
  );
}
