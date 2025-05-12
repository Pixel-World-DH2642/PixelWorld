import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { fetchPaintingById } from "./detailSlice";

export const selectAndFetchPainting = createAsyncThunk(
  "museum/selectAndFetchPainting",
  async (paintingId, thunkAPI) => {
    console.log("selectAndFetchPainting", paintingId);
    // First dispatch the action to select the painting in the museum
    thunkAPI.dispatch(selectPainting(paintingId));

    // Then fetch the painting details
    return thunkAPI.dispatch(fetchPaintingById(paintingId));
  },
);

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

// Add new selectors
export const selectMuseumLoading = (state) => state.museum.isLoading;
export const selectMuseumError = (state) => state.museum.error;

// Export actions
export const { setPaintings, selectPainting, nextPaintings, prevPaintings } =
  museumSlice.actions;

// Selectors
export const selectAllPaintings = (state) => state.museum.paintings;
//show the paintings which fit on the screen (max 3 - paintingsPerPage)
export const selectCurrentPaintings = (state) => {
  const { paintings, startIndex, paintingsPerPage } = state.museum;
  return paintings.slice(startIndex, startIndex + paintingsPerPage);
};
export const selectIsFirstPage = (state) => state.museum.startIndex === 0;
export const selectIsLastPage = (state) => {
  const { startIndex, paintingsPerPage, paintings } = state.museum;
  return startIndex + paintingsPerPage >= paintings.length;
};

export default museumSlice.reducer;
