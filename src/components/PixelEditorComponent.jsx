import "../styles/global.css";
//import "./assets/pixel_editor_assets/pencil_icon.png";

export function PixelEditorComponent({
  //State Properties
  colorPaletteArray,
  //Functions
  onToolSelect,
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
  randomizePalette();

  let selectedPaletteSlot = null;

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
        }
      : null;
  }

  //Callbacks: Hook into PixelEditor container
  function handlePaletteClickedACB(e) {
    if (!e.target.dataset.color || e.target === selectedPaletteSlot) return;
    console.log(e.target);

    if (selectedPaletteSlot) selectedPaletteSlot.className = "palette_slot";
    selectedPaletteSlot = e.target;
    selectedPaletteSlot.className = "selected_palette_cell";
    //console.log(e.target.dataset.color);
  }

  function handleColorChangeACB(e) {
    console.log(hexToRgb(e.target.value));
  }

  function randomizePalette() {
    for (let i = 0; i < numPaletteSlots; i++) {
      palette[i] = { id: `paletteSlot${i}`, color: randomColor() };
    }
  }

  //Layout
  //Create palette slot elements
  const paletteSlots = palette.map((slot) => (
    <div
      className="palette_cell"
      key={slot.id}
      id={slot.id}
      data-color={slot.color}
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
