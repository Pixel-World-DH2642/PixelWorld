import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { randomColor, hexToRgb } from "/src/utils/color";

export const TOOL_MODE = {
  ERASER: "eraser",
  PENCIL: "pencil",
  FILL: "fill",
  //...
};

export const fetchUserColorPalette = createAsyncThunk(
  "editor/fetchUserColorPalette",
  async (userId, { rejectWithValue }) => {
    try {
      // Import required Firebase functions
      const { collection, getDocs, query, where } = await import(
        "firebase/firestore"
      );
      const { db } = await import("../firebase");

      if (!userId) {
        throw new Error("No user ID provided");
      }

      const userPaletteRef = collection(db, "userPalettes");
      const q = query(userPaletteRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No saved color palette found for user:", userId);
        return null;
      }

      const paletteData = snapshot.docs[0].data();
      const colorPaletteArray = JSON.parse(paletteData.colorPaletteArray);

      console.log("Retrieved user color palette:", colorPaletteArray);
      return { colorPaletteArray, isFromFirebase: true };
    } catch (error) {
      console.error("Error fetching user color palette:", error);
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  colorPaletteArray: [], // Will store the actual hex color values
  currentColor: { rgba: { r: 0, g: 0, b: 0, a: 0 }, hex: "#00000000" },
  currentTool: TOOL_MODE.PENCIL,
  selectedPaletteSlot: 0,
};

export const pixelEditorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setCurrentTool: (state, action) => {
      state.currentTool = action.payload;
    },
    setCurrentColor: (state, action) => {
      state.currentColor = action.payload;
    },
    updateColorPalette: (state, action) => {
      // Update a specific palette slot with a color
      const { index, color } = action.payload;
      state.colorPaletteArray[index] = color;

      // If this is the selected slot, update current color too
      if (index === state.selectedPaletteSlot) {
        state.currentColor = {
          rgba: hexToRgb(color),
          hex: color,
        };
      }
    },
    setColorPalette: (state, action) => {
      state.colorPaletteArray = action.payload;
    },
    setCurrentPaletteSlot: (state, action) => {
      state.selectedPaletteSlot = action.payload;

      // Update currentColor to match the selected palette slot
      if (state.colorPaletteArray[action.payload]) {
        const hexColor = state.colorPaletteArray[action.payload];
        state.currentColor = {
          rgba: hexToRgb(hexColor),
          hex: hexColor,
        };
      }
    },
    randomizePalette: (state) => {
      // Generate 16 random colors
      const newPalette = Array(16)
        .fill(0)
        .map(() => randomColor());
      state.colorPaletteArray = newPalette;

      // Update current color to match the selected slot
      const hexColor = newPalette[state.selectedPaletteSlot];
      state.currentColor = {
        rgba: hexToRgb(hexColor),
        hex: hexColor,
      };
    },
    resetEditor: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserColorPalette.fulfilled, (state, action) => {
      if (action.payload && action.payload.colorPaletteArray) {
        state.colorPaletteArray = action.payload.colorPaletteArray;

        // Update current color to match the selected slot
        const hexColor =
          action.payload.colorPaletteArray[state.selectedPaletteSlot];
        if (hexColor) {
          state.currentColor = {
            rgba: hexToRgb(hexColor),
            hex: hexColor,
          };
        }
      }
    });
  },
});

//Actions
export const {
  setCurrentTool,
  setCurrentColor,
  updateColorPalette,
  setColorPalette,
  setCurrentPaletteSlot,
  randomizePalette,
  resetEditor,
} = pixelEditorSlice.actions;

//Selectors

export default pixelEditorSlice.reducer;
