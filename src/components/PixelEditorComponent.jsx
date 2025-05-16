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

    document.getElementById(palette[0].id).className = "palette_slot";
    e.target.className = "selected_palette_cell";
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
      className="palette_cell"
      key={slot.id}
      id={slot.id}
      data-color={slot.color}
      data-index={slot.index}
      style={{ backgroundColor: slot.color }}
    ></div>
  ));

  return (
    <div className="pixel_editor">
      <div className="palette">
        <div>Palette</div>
        <div
          className="palette_grid_container"
          onClick={handlePaletteClickedACB}
        >
          {paletteSlots}
        </div>
      </div>

      <div className="toolbox">
        <div className="toolbox_grid_container">
          <div>
            <input
              type="color"
              id="picker"
              name="color"
              value="#e62465"
              onChange={handleColorChangeACB}
            />
          </div>
          <div>Undo</div>
          <div>Redo</div>
          <div>Randomize</div>
          <div>
            Pencil
            <div>
              <img src="assets/pencil_icon_64x64.png" alt="pencil" />
            </div>
          </div>
          <div>
            Eraser
            <div>
              <img src="assets/eraser_icon_64x64.png" alt="pencil" />
            </div>
          </div>
          <div>Fill</div>
        </div>
      </div>
    </div>
  );
}
