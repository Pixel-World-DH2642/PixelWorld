import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const fetchPaintings = createAsyncThunk(
  "museum/fetchPaintings",
  async (_, thunkAPI) => {
    try {
      const paintingsCollection = collection(db, "paintings");
      const paintingsSnapshot = await getDocs(paintingsCollection);
      const paintings = paintingsSnapshot.docs.map((doc) => {
        const data = doc.data();

        // Convert Firestore Timestamp objects to serializable format
        const serializedData = Object.entries(data).reduce(
          (acc, [key, value]) => {
            // Check if the value is a Timestamp
            if (value && typeof value.toDate === "function") {
              // Convert to ISO string or timestamp number
              acc[key] = value.toDate().toISOString();
            } else {
              acc[key] = value;
            }
            return acc;
          },
          {},
        );

        return {
          id: doc.id,
          ...serializedData,
        };
      });
      return paintings;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const initialState = {
  paintings: [],
  selectedPaintingId: null,
  startIndex: 0,
  paintingsPerPage: 3,
  isLoading: false,
  error: null,
};

export const museumSlice = createSlice({
  name: "museum",
  initialState,
  reducers: {
    setPaintings: (state, action) => {
      state.paintings = action.payload;
    },
    selectPainting: (state, action) => {
      state.selectedPaintingId = action.payload;
    },
    nextPaintings: (state) => {
      if (state.startIndex + state.paintingsPerPage < state.paintings.length) {
        state.startIndex += state.paintingsPerPage;
      }
    },
    prevPaintings: (state) => {
      if (state.startIndex > 0) {
        state.startIndex -= state.paintingsPerPage;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaintings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaintings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paintings = action.payload;
      })
      .addCase(fetchPaintings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { setPaintings, selectPainting, nextPaintings, prevPaintings } =
  museumSlice.actions;

export default museumSlice.reducer;
