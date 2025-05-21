import "../styles/global.css";
import { TOOL_MODE } from "../app/slices/pixelEditorSlice";
import { useEffect } from "react";
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
  onRandomizePalette, // Add this new prop
  //Painting Functions
  onUndoEdit,
  onRedoEdit,
  onPlayerPaintingUpdate,
  undoHint,
}) {
  const numPaletteSlots = 16;

  // Initialize palette effect - only if it's empty
  useEffect(() => {
    if (colorPaletteArray.length === 0) {
      // Generate a random palette on first load
      const initialPalette = Array(numPaletteSlots)
        .fill(0)
        .map(() => randomColor());
      onPaletteInitialize(initialPalette);
    }
  }, []);

  //Callbacks: Hook into PixelEditor container
  function handlePaletteClickedACB(e) {
    if (!e.target.dataset.color) return;

    const clickedSlotIndex = parseInt(e.target.dataset.index);
    if (clickedSlotIndex === selectedPaletteSlot) return;

    // Just update the selected slot in the Redux store - the color update happens there
    onSlotSelected(clickedSlotIndex);
  }

  function handleColorChangeACB(e) {
    const newColor = e.target.value;

    // Update the color in the palette at the selected slot
    onPaletteUpdated({
      index: selectedPaletteSlot,
      color: newColor,
    });
  }

  function handleEraserSelected() {
    onToolSelect(TOOL_MODE.ERASER);
  }

  function handlePencilSelected() {
    onToolSelect(TOOL_MODE.PENCIL);
  }

  function handleRandomizeClicked() {
    // Use the Redux action to randomize the palette
    onRandomizePalette();
  }

  function handleUndoEdit() {
    onUndoEdit();
  }

  function handleRedoEdit() {
    onRedoEdit();
  }

  function handleClearPlayerPainting() {
    const emptyPixelArray = Array.from({ length: 16 }, () =>
      Array(16).fill(null),
    );
    onPlayerPaintingUpdate(emptyPixelArray);
  }

  // Create palette slots directly from the Redux state
  const paletteSlots = Array.from({ length: numPaletteSlots }).map(
    (_, index) => (
      <div
        className={`aspect-square ${selectedPaletteSlot === index ? "outline-2 outline outline-black" : ""}`}
        key={`paletteSlot${index}`}
        id={`paletteSlot${index}`}
        data-color={colorPaletteArray[index] || "#000000"}
        data-index={index}
        style={{ backgroundColor: colorPaletteArray[index] || "#000000" }}
      ></div>
    ),
  );

  return (
    <div className="flex flex-col w-full h-full bg-gray-300 p-2 gap-2 overflow-y-scroll">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl">Pixel Editor</div>
        <div
          className={`text-sm flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 p-1 rounded-md hover:bg-gray-200 active:bg-blue-300`}
          onClick={handleClearPlayerPainting}
        >
          Clear Canvas
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <div
          className="inline-grid grid-cols-4 gap-1 w-full aspect-square cursor-pointer p-4 bg-gray-100 rounded-md"
          onClick={handlePaletteClickedACB}
        >
          {paletteSlots}
        </div>

        <div className="grid grid-cols-3 gap-1 text-sm rounded-md bg-gray-100 p-2 w-full">
          <div className="flex flex-col items-center justify-center">
            <input
              type="color"
              id="picker"
              name="color"
              value={currentColor.hex || "#000000"}
              className="cursor-pointer"
              onChange={handleColorChangeACB}
              disabled={selectedPaletteSlot === null}
            />
            <p>Color</p>
          </div>
          <div
            className={`flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 p-1 rounded-md hover:bg-gray-200 active:bg-blue-300`}
            onClick={handleRandomizeClicked}
          >
            <img
              className="w-6"
              src="assets/random_icon_64x64.png"
              alt="randomize palette"
            />
            <p>Random</p>
          </div>
          <div
            className={`flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 p-1 rounded-md ${
              currentTool === TOOL_MODE.PENCIL
                ? "bg-blue-200 border-blue-500"
                : "hover:bg-gray-200"
            } active:bg-blue-300`}
            onClick={handlePencilSelected}
          >
            <img
              className="w-6"
              src="assets/pencil_icon_64x64.png"
              alt="pencil"
            />
            <p className={currentTool === TOOL_MODE.PENCIL ? "font-bold" : ""}>
              Pencil
            </p>
          </div>
          <div
            className={`flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 p-1 rounded-md ${
              currentTool === TOOL_MODE.ERASER
                ? "bg-blue-200 border-blue-500"
                : "hover:bg-gray-200"
            } active:bg-blue-300`}
            onClick={handleEraserSelected}
          >
            <img
              className="w-6"
              src="assets/eraser_icon_64x64_new.png"
              alt="eraser"
            />
            <p className={currentTool === TOOL_MODE.ERASER ? "font-bold" : ""}>
              Eraser
            </p>
          </div>
          <div
            className={`flex flex-col items-center justify-center transition-transform duration-200 p-1 rounded-md ${
              undoHint?.canUndo
                ? "cursor-pointer hover:bg-gray-200 active:bg-blue-300"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={undoHint?.canUndo ? handleUndoEdit : undefined}
          >
            <img className="w-6" src="assets/undo_icon_64x64.png" alt="undo" />
            <p>Undo</p>
          </div>

          <div
            className={`flex flex-col items-center justify-center transition-transform duration-200 p-1 rounded-md ${
              undoHint?.canRedo
                ? "cursor-pointer hover:bg-gray-200 active:bg-blue-300"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={undoHint?.canRedo ? handleRedoEdit : undefined}
          >
            <img className="w-6" src="assets/redo_icon_64x64.png" alt="redo" />
            <p>Redo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
